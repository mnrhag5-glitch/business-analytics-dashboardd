


import { useEffect, useState } from "react";
import {
  Activity,
  BadgeIndianRupee,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  eachDayOfInterval,
  isValid,
  differenceInCalendarDays,
  subDays,
  startOfDay,
} from "date-fns";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DateRangeFilter from "../components/filters/DateRangeFilter";
import UserFilter from "../components/filters/UserFilter";
import DepartmentFilter from "../components/filters/DepartmentFilter";
import KpiCard from "../components/dashboard/KpiCard";
import ChartCard from "../components/dashboard/ChartCard";

import LeadFunnel from "../components/charts/LeadFunnel";
import LeadTrendChart from "../components/charts/LeadTrendChart";
import { QuotationStatusChart } from "../components/charts/QuotationCharts";
import {
  RevenueTrendChart,
  DealStatusChart,
} from "../components/charts/RevenueCharts";

import DataTable from "../components/tables/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import ProgressBar from "../components/common/ProgressBar";
import Avatar from "../components/common/Avatar";

import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { users } from "../data/users";

import {
  formatCurrency,
  formatCompactCurrency,
  formatDate,
} from "../utils/formatters";

function getSafeChartDays(start, end) {
  if (!isValid(start) || !isValid(end) || start > end) {
    return [];
  }

  const safeEnd = startOfDay(end);
  const safeStart =
    differenceInCalendarDays(safeEnd, startOfDay(start)) > 365
      ? subDays(safeEnd, 365)
      : startOfDay(start);

  return eachDayOfInterval({
    start: safeStart,
    end: safeEnd,
  });
}

export default function DashboardPage() {
  const {
    preset,
    setPreset,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    userId,
    setUserId,
    departmentId,
    setDepartmentId,
  } = useDashboardFilters();

  const analytics = useAnalytics({
    preset,
    customStart,
    customEnd,
    userId,
    departmentId,
  });

  const {
    currentLeads = [],
    previousLeads = [],
    currentQuotations = [],
    currentDeals = [],
    currentOrders = [],
    currentPayments = [],
    currentActivities = [],
    ownedDeals = [],
    ownedOrders = [],
    leadAnalytics,
    revenueAnalytics,
    dateRange,
  } = analytics;

  const previousLeadCount = previousLeads.length;

  const leadChange = previousLeadCount
    ? ((currentLeads.length - previousLeadCount) /
        previousLeadCount) *
      100
    : currentLeads.length
      ? 100
      : 0;

  const wonDeals = currentDeals.filter(
    (deal) => deal.status === "Won",
  );

  const activeDeals = currentDeals.filter(
    (deal) => !["Won", "Lost"].includes(deal.status),
  );

  const completedPayments = currentPayments.filter(
    (payment) => payment.status === "Completed",
  );

  const trendCounts = currentLeads.reduce((result, lead) => {
    const date = new Date(lead.createdAt);

    if (!isValid(date)) return result;

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    result[key] = (result[key] || 0) + 1;

    return result;
  }, {});

  const trendData =
    dateRange?.startDate &&
    dateRange?.endDate &&
    isValid(new Date(dateRange.startDate)) &&
    isValid(new Date(dateRange.endDate))
      ? getSafeChartDays(
  new Date(dateRange.startDate),
  new Date(dateRange.endDate),
).map((date) => {
          const key = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-");

          return {
            date: key,
            label: formatDate(date).replace(/\s\d{4}$/, ""),
            leads: trendCounts[key] || 0,
          };
        })
      : [];

  const revenueMap = completedPayments.reduce((result, payment) => {
    const key = String(payment.paymentDate).slice(0, 10);

    result[key] =
      (result[key] || 0) + (Number(payment.amount) || 0);

    return result;
  }, {});

  const revenueTrendData =
    dateRange?.startDate &&
    dateRange?.endDate &&
    isValid(new Date(dateRange.startDate)) &&
    isValid(new Date(dateRange.endDate))
      ? getSafeChartDays(
  new Date(dateRange.startDate),
  new Date(dateRange.endDate),
).map((date) => {
          const key = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-");

          return {
            date: key,
            label: formatDate(date).replace(/\s\d{4}$/, ""),
            revenue: revenueMap[key] || 0,
          };
        })
      : [];

  const quotationStatusData = Object.entries(
    currentQuotations.reduce((result, quotation) => {
      result[quotation.status] =
        (result[quotation.status] || 0) + 1;

      return result;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

const dealsForPipeline = ownedDeals.filter((deal) => {
  if (!dateRange?.endDate) return true;

  const createdAt = new Date(deal.createdAt);
  const periodEnd = new Date(dateRange.endDate);

  return (
    !Number.isNaN(createdAt.getTime()) &&
    createdAt <= periodEnd
  );
});

const dealStatusData = Object.entries(
  dealsForPipeline.reduce((result, deal) => {
    result[deal.status] =
      (result[deal.status] || 0) + 1;

    return result;
  }, {}),
).map(([name, value]) => ({ name, value }));

  const activityRows = [...currentActivities]
    .sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    )
    .slice(0, 5);

  const recentDeals = [...ownedDeals]
    .sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    )
    .slice(0, 8);

  const recentOrders = [...ownedOrders]
    .sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt)),
    )
    .slice(0, 8);

  const leadColumns = [
    {
      header: "Lead",
      accessor: "name",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800">
            {row.name || "Unnamed company"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {row.id}
          </p>
        </div>
      ),
    },
    {
      header: "Service",
      accessor: "service",
    },
    {
      header: "Source",
      accessor: "source",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Value",
      accessor: "estimatedValue",
      render: (row) => formatCurrency(row.estimatedValue),
    },
  ];

  const dealColumns = [
  {
  header: "Deal",
  accessor: "id",
  searchValue: (row) => `${row.name ?? ""} ${row.service ?? ""} ${row.id ?? ""}`,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-800">
            {row.name || row.id}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {row.service}
          </p>
        </div>
      ),
    },
    {
      header: "Owner",
      accessor: "assignedTo",
      render: (row) => {
        const owner = users.find(
          (user) => user.id === row.assignedTo,
        );

        return owner ? (
          <Avatar
            name={owner.name}
            initials={owner.avatar}
            showName
          />
        ) : (
          "—"
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Progress",
      accessor: "progress",
      render: (row) => <ProgressBar value={row.progress} />,
    },
    {
      header: "Value",
      accessor: "value",
      render: (row) => formatCurrency(row.value),
    },
  ];

  const orderColumns = [
    {
      header: "Order",
      accessor: "orderNumber",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => formatCurrency(row.amount),
    },
    {
      header: "Progress",
      accessor: "progress",
      render: (row) => <ProgressBar value={row.progress} />,
    },
    {
      header: "Due date",
      accessor: "dueDate",
      render: (row) =>
        row.dueDate ? formatDate(row.dueDate) : "—",
    },
  ];

  const periodLabel =
    dateRange?.startDate && dateRange?.endDate
      ? `${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)}`
      : "Selected period";



const [globalSearch, setGlobalSearch] = useState("");

useEffect(() => {
  const handleDashboardSearch = (event) => {
    setGlobalSearch(event.detail?.query ?? "");
  };

  window.addEventListener("dashboard-search", handleDashboardSearch);

  return () => {
    window.removeEventListener(
      "dashboard-search",
      handleDashboardSearch
    );
  };
}, []);


  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Business Overview"
          description="Monitor leads, quotations, deals and revenue performance."
        />

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-end xl:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <DateRangeFilter
              preset={preset}
              onPresetChange={setPreset}
              customStart={customStart}
              customEnd={customEnd}
              onCustomStartChange={setCustomStart}
              onCustomEndChange={setCustomEnd}
            />

            <UserFilter
              value={userId}
              onChange={setUserId}
            />

            <DepartmentFilter
              value={departmentId}
              onChange={setDepartmentId}
            />
          </div>

          <p className="shrink-0 text-sm text-slate-500">
            <span className="font-medium text-slate-700">
              Reporting period:
            </span>{" "}
            {periodLabel}
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          <KpiCard
            title="Total Leads"
            value={currentLeads.length}
            change={leadChange}
            icon={Users}
            accent="indigo"
            description="Leads in selected period"
          />

          <KpiCard
            title="Quotations"
            value={currentQuotations.length}
            icon={FileText}
            accent="blue"
            description="Quotes created in period"
          />

          <KpiCard
            title="Active Deals"
            value={activeDeals.length}
            icon={BriefcaseBusiness}
            accent="violet"
            description="Open sales opportunities in selected period"
          />

          <KpiCard
            title="Collected Revenue"
            value={formatCompactCurrency(
              revenueAnalytics?.collected ?? 0,
            )}
            icon={BadgeIndianRupee}
            accent="green"
            description={`${completedPayments.length} completed payments in the selected period`}
          />

          <KpiCard
            title="Outstanding"
            value={formatCompactCurrency(
              revenueAnalytics?.outstanding ?? 0,
            )}
            icon={ClipboardList}
            accent="amber"
            description="Outstanding order balance"
          />

          <KpiCard
            title="Won Deals"
            value={wonDeals.length}
            icon={Activity}
            accent="teal"
            description="Deals marked won in selected period"
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title="Lead acquisition trend"
            subtitle="New leads created during the selected period"
          >
            <div className="h-72 w-full">
              <LeadTrendChart data={trendData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Lead funnel"
            subtitle="Lead progression for the selected period"
          >
            <div className="h-72 w-full">
              <LeadFunnel data={leadAnalytics?.funnel ?? []} />
            </div>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title="Quotation status"
            subtitle={`${currentQuotations.length} quotations in the selected period`}
          >
            <div className="h-72 w-full">
              <QuotationStatusChart data={quotationStatusData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Collected revenue trend"
            subtitle="Completed payments grouped by payment date"
          >
            <div className="h-72 w-full">
              <RevenueTrendChart data={revenueTrendData} />
            </div>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title="Deal pipeline"
subtitle="Current deal pipeline by sales status, through the selected period end"          >
            <div className="h-72 w-full">
              <DealStatusChart data={dealStatusData} />
            </div>
          </ChartCard>

          <ChartCard
            title="Recent activity"
            subtitle="Latest CRM updates in the selected period"
            action={
              <Link
                to="/activity"
                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                View all
              </Link>
            }
          >
            <div className="divide-y divide-slate-100">
              {activityRows.length > 0 ? (
                activityRows.map((activity) => {
                  const owner = users.find(
                    (user) => user.id === activity.userId,
                  );

                  return (
                    <div
                      className="flex gap-3 py-4 first:pt-0 last:pb-0"
                      key={activity.id}
                    >
                      <Avatar
                        name={owner?.name || "Team"}
                        initials={owner?.avatar}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(activity.createdAt)} ·{" "}
                          {owner?.name || "Team member"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  No activity in this period.
                </p>
              )}
            </div>
          </ChartCard>
        </section>

        <ChartCard
          title="Recent leads"
          subtitle="Latest lead records matching your filters"
          action={
            <Link
              to="/leads"
              className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              View all
            </Link>
          }
        >
          <DataTable
            columns={leadColumns}
            data={[...currentLeads]
              .sort((a, b) =>
                String(b.createdAt).localeCompare(String(a.createdAt)),
              )
              .slice(0, 8)}
            pageSize={5}
          />
        </ChartCard>

        <section className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
          <ChartCard
            title="Recent deals"
            subtitle="Latest sales opportunities across your selected team"
            action={
              <Link
                to="/deals"
                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                View all
              </Link>
            }
          >
            <DataTable
              columns={dealColumns}
              data={recentDeals}
              pageSize={4}
            />
          </ChartCard>

          <ChartCard
            title="Orders overview"
            subtitle="Recent orders across deals owned by your selected team"
            action={
              <Link
                to="/orders"
                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                View all
              </Link>
            }
          >
            <DataTable
              columns={orderColumns}
              data={recentOrders}
              pageSize={4}
            />
          </ChartCard>
        </section>
      </div>
    </AppLayout>
  );
}
