
import { getCollectedAmount, getOutstandingAmount } from "./revenue";

const sumBy = (items = [], field) =>
  items.reduce((total, item) => {
    const amount = Number(item?.[field]);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

const countBy = (items = [], field) =>
  items.reduce((result, item) => {
    const key = item?.[field] || "Unknown";
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});

const percentage = (part, total) =>
  total > 0 ? (part / total) * 100 : 0;



export function getLeadAnalytics(leads = []) {
  const byStatus = countBy(leads, "status");
  const total = leads.length;

  const stageDefinitions = [
    { name: "New", statuses: ["New"] },
    { name: "Contacted", statuses: ["Contacted"] },
    { name: "Qualified", statuses: ["Qualified"] },
    { name: "Converted", statuses: ["Converted"] },
  ];

  const funnel = stageDefinitions.map(({ name, statuses }) => ({
    name,
    value: leads.filter((lead) => statuses.includes(lead.status)).length,
  }));

  const qualified = leads.filter(
    (lead) =>
      lead.status === "Qualified" ||
      lead.qualification === "Qualified"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  return {
    total,
    byStatus,
    qualified,
    converted,
    qualificationRate: total > 0 ? (qualified / total) * 100 : 0,
    conversionRate: total > 0 ? (converted / total) * 100 : 0,
    estimatedValue: sumBy(leads, "estimatedValue"),
    funnel,
  };
}


export function getQuotationAnalytics(quotations = [], deals = []) {
  const byStatus = countBy(quotations, "status");
  const total = quotations.length;

  const accepted = quotations.filter(
    (quotation) => quotation.status === "Accepted"
  );

  const rejected = quotations.filter(
    (quotation) => quotation.status === "Rejected"
  );

  // Match quotations linked to deals through quotationId
  const quotationIdsWithDeals = new Set(
    deals
      .map((deal) => deal.quotationId)
      .filter(Boolean)
  );

  const convertedToDeals = quotations.filter(
    (quotation) =>
      quotationIdsWithDeals.has(quotation.id)
  ).length;

  return {
    total,
    byStatus,
    accepted: accepted.length,
    rejected: rejected.length,
    acceptedValue: sumBy(accepted, "amount"),
    acceptanceRate: percentage(accepted.length, total),
    convertedToDeals,
    conversionRate: percentage(convertedToDeals, total),
  };
}

export function getDealAnalytics(deals = []) {
  const byStatus = countBy(deals, "status");
  const total = deals.length;
  const won = deals.filter((deal) => deal.status === "Won");
  const lost = deals.filter((deal) => deal.status === "Lost");
  const decided = won.length + lost.length;

  return {
    total,
    byStatus,
    won: won.length,
    lost: lost.length,
    active: total - decided,
    wonValue: sumBy(won, "value"),
    totalValue: sumBy(deals, "value"),
    winRate: percentage(won.length, decided),
  };
}

export function getOrderAnalytics(orders = [], payments = []) {
  const byStatus = countBy(orders, "status");
  const total = orders.length;
  const completed = orders.filter(
    (order) => order.status === "Completed"
  );
  const paid = getCollectedAmount(payments);
  const outstanding = getOutstandingAmount(orders, payments);

  return {
    total,
    byStatus,
    completed: completed.length,
    completionRate: percentage(completed.length, total),
    totalValue: sumBy(orders, "amount"),
    collected: paid,
    outstanding,
    paymentStatusTotals: payments.reduce(
      (result, payment) => {
        const amount = Number(payment.amount);
        const safeAmount =
          Number.isFinite(amount) && amount >= 0 ? amount : 0;

        if (payment.status === "Completed") {
          result.completed += safeAmount;
        } else if (payment.status === "Pending") {
          result.pending += safeAmount;
        } else if (payment.status === "Failed") {
          result.failed += safeAmount;
        }

        return result;
      },
      { completed: 0, pending: 0, failed: 0 }
    ),
  };
}
