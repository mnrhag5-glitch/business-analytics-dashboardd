
import { useMemo } from "react";

import { leads } from "../data/leads";
import { quotations } from "../data/quotations";
import { deals } from "../data/deals";
import { orders } from "../data/orders";
import { payments } from "../data/payments";
import { activities } from "../data/activities";
import { users } from "../data/users";
import { departments } from "../data/departments";

import {
  getDateRange,
  getPreviousDateRange,
  isDateInRange,
} from "../utils/dateUtils";

import {
  getLeadAnalytics,
  getQuotationAnalytics,
  getDealAnalytics,
  getOrderAnalytics,
} from "../utils/analytics";

import {
  getCollectedAmount,
  getOutstandingAmount,
} from "../utils/revenue";

function matchesOwner(item, userId, departmentId) {
  const ownerId = item.assignedTo ?? item.userId;

  const owner = users.find((user) => user.id === ownerId);

  if (userId !== "all" && ownerId !== userId) {
    return false;
  }

  if (
    departmentId !== "all" &&
    item.departmentId !== departmentId &&
    owner?.departmentId !== departmentId
  ) {
    return false;
  }

  return true;
}

function filterByDate(items, dateField, range) {
  return items.filter((item) =>
    isDateInRange(item[dateField], range),
  );
}

function sumAmount(items, field = "amount") {
  return items.reduce(
    (total, item) => total + (Number(item[field]) || 0),
    0,
  );
}

function isOnOrBefore(value, endDate) {
  if (!value || !endDate) return false;

  const date = new Date(value);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getTime() <= endDate.getTime()
  );
}

export default function useAnalytics({
  preset = "30d",
  customStart = "",
  customEnd = "",
  userId = "all",
  departmentId = "all",
} = {}) {
  return useMemo(() => {
    const dateRange = getDateRange(
      preset,
      customStart,
      customEnd,
      new Date(),
    );

    const previousDateRange = getPreviousDateRange(dateRange);

    const ownerFilter = (item) =>
      matchesOwner(item, userId, departmentId);

    // Leads created during the selected period.
    const currentLeads = filterByDate(
      leads,
      "createdAt",
      dateRange,
    ).filter(ownerFilter);

    const previousLeads = filterByDate(
      leads,
      "createdAt",
      previousDateRange,
    ).filter(ownerFilter);

    // Quotations created during the selected period.
    const currentQuotations = filterByDate(
      quotations,
      "createdAt",
      dateRange,
    ).filter(ownerFilter);

    // Deals created during the selected period.
    const currentDeals = filterByDate(
      deals,
      "createdAt",
      dateRange,
    ).filter(ownerFilter);

    // All deals matching the selected team and department.
    // Used for recent-record tables, not date-filtered KPIs.
    const ownedDeals = deals.filter(ownerFilter);

    const ownedDealIds = new Set(
      ownedDeals.map((deal) => deal.id),
    );

    // All orders belonging to the matching deals.
    const ownedOrders = orders.filter((order) =>
      ownedDealIds.has(order.dealId),
    );

    // Orders created during the selected period.
    const currentOrders = filterByDate(
      ownedOrders,
      "createdAt",
      dateRange,
    );

    const currentOrderIds = new Set(
      currentOrders.map((order) => order.id),
    );

    // Revenue is based on payment date, not order creation date.
    const currentPayments = filterByDate(
      payments,
      "paymentDate",
      dateRange,
    ).filter((payment) =>
      ownedDealIds.has(payment.dealId),
    );

    // Payment history through the selected period's end is
    // needed to calculate outstanding balances accurately.
    const paymentsThroughPeriodEnd = payments.filter(
      (payment) =>
        ownedDealIds.has(payment.dealId) &&
        isOnOrBefore(
          payment.paymentDate,
          dateRange.endDate,
        ),
    );

    const paymentsForCurrentOrders =
      paymentsThroughPeriodEnd.filter((payment) =>
        currentOrderIds.has(payment.orderId),
      );

    const currentActivities = filterByDate(
      activities,
      "createdAt",
      dateRange,
    ).filter(ownerFilter);

    const currentRevenue = getCollectedAmount(
      currentPayments,
    );

    const outstandingRevenue = getOutstandingAmount(
      ownedOrders,
      paymentsThroughPeriodEnd,
    );

    return {
      dateRange,
      previousDateRange,

      currentLeads,
      previousLeads,
      currentQuotations,
      currentDeals,
      currentOrders,

      // Required by Recent Deals and Orders Overview tables.
      ownedDeals,
      ownedOrders,

      currentPayments,
      currentActivities,

      leadAnalytics: getLeadAnalytics(currentLeads),

      quotationAnalytics: getQuotationAnalytics(
        currentQuotations,
        currentDeals,
      ),

      dealAnalytics: getDealAnalytics(currentDeals),

      orderAnalytics: getOrderAnalytics(
        currentOrders,
        paymentsForCurrentOrders,
      ),

      revenueAnalytics: {
        collected: currentRevenue,
        outstanding: outstandingRevenue,
        dealValue: sumAmount(currentDeals, "value"),
        orderValue: sumAmount(currentOrders, "amount"),
        paymentCount: currentPayments.length,
      },

      filters: {
        preset,
        customStart,
        customEnd,
        userId,
        departmentId,
      },

      availableDepartments: departments,
    };
  }, [
    preset,
    customStart,
    customEnd,
    userId,
    departmentId,
  ]);
}
