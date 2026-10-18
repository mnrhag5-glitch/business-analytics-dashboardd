
import { useMemo } from "react";
import {
  Download,
  ShoppingBag,
  Wallet,
  CheckCircle2,
  ChartNoAxesColumnIncreasing,
  CreditCard,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DataTable from "../components/tables/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import ProgressBar from "../components/common/ProgressBar";
import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { deals } from "../data/deals";
import { users } from "../data/users";
import { formatCurrency, formatDate } from "../utils/formatters";
import { exportToCSV } from "../utils/exportUtils";

const getOwnerName = (id) =>
  users.find((user) => user.id === id)?.name ?? "—";

const getDeal = (id) => deals.find((deal) => deal.id === id);

export default function OrdersPage() {
  const filters = useDashboardFilters();
  const analytics = useAnalytics(filters);

  const rows = useMemo(
    () =>
      [...analytics.currentOrders].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [analytics.currentOrders],
  );

  const completedOrders = rows.filter(
    (order) => order.status === "Completed",
  );

  const totalValue = rows.reduce(
    (sum, order) => sum + (Number(order.amount) || 0),
    0,
  );

  const completionRate = rows.length
    ? Math.round((completedOrders.length / rows.length) * 100)
    : 0;

  const currentOrderIds = new Set(rows.map((order) => order.id));

  const paymentsForCurrentOrders = analytics.currentPayments.filter(
    (payment) => currentOrderIds.has(payment.orderId),
  );

  const collectedForCurrentOrders = paymentsForCurrentOrders
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  const columns = [
    {
      header: "Order",
      accessor: "orderNumber",
      searchValue: (row) => `${row.orderNumber ?? ""} ${row.id}`,
      render: (row) => (
        <div className="min-w-28">
          <p className="font-semibold text-slate-800">
            {row.orderNumber || row.id}
          </p>
          <p className="mt-1 text-xs text-slate-400">{row.id}</p>
        </div>
      ),
    },
    {
      header: "Related deal",
      accessor: "dealId",
      searchValue: (row) => {
        const deal = getDeal(row.dealId);
        return `${row.dealId} ${deal?.name ?? ""} ${deal?.service ?? ""}`;
      },
      render: (row) => {
        const deal = getDeal(row.dealId);

        return (
          <div className="min-w-40">
            <p className="font-medium text-slate-800">
              {deal?.name || row.dealId}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {deal?.service || "Service unavailable"}
            </p>
            <p className="mt-1 text-xs text-slate-400">{row.dealId}</p>
          </div>
        );
      },
    },
    {
      header: "Owner",
      accessor: "assignedTo",
      searchValue: (row) => getOwnerName(row.assignedTo),
      render: (row) => getOwnerName(row.assignedTo),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Order value",
      accessor: "amount",
      render: (row) => (
        <span className="whitespace-nowrap font-semibold tabular-nums text-slate-800">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Collected in period",
      accessor: "id",
      searchValue: (row) => {
        const amount = analytics.currentPayments
          .filter(
            (payment) =>
              payment.orderId === row.id &&
              payment.status === "Completed",
          )
          .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

        return String(amount);
      },
      render: (row) => {
        const amount = analytics.currentPayments
          .filter(
            (payment) =>
              payment.orderId === row.id &&
              payment.status === "Completed",
          )
          .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

        return (
          <span className="whitespace-nowrap font-medium tabular-nums text-emerald-700">
            {formatCurrency(amount)}
          </span>
        );
      },
    },
    {
      header: "Progress",
      accessor: "progress",
      render: (row) => (
        <div className="min-w-28">
          <ProgressBar value={row.progress} size="small" />
          <p className="mt-1 text-xs text-slate-500">{row.progress}%</p>
        </div>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: "Due date",
      accessor: "dueDate",
      render: (row) => (row.dueDate ? formatDate(row.dueDate) : "—"),
    },
  ];

  function handleExport() {
    exportToCSV(
      rows.map((order) => {
        const deal = getDeal(order.dealId);

        const collected = analytics.currentPayments
          .filter(
            (payment) =>
              payment.orderId === order.id &&
              payment.status === "Completed",
          )
          .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

        return {
          ID: order.id,
          OrderNumber: order.orderNumber,
          DealID: order.dealId,
          DealName: deal?.name ?? "",
          Service: deal?.service ?? "",
          Owner: getOwnerName(order.assignedTo),
          Status: order.status,
          Amount: order.amount,
          CollectedInSelectedPeriod: collected,
          Progress: order.progress,
          CreatedAt: order.createdAt,
          DueDate: order.dueDate,
        };
      }),
      "orders-report.csv",
    );
  }

  const summaryCards = [
    {
      label: "Total orders",
      value: rows.length,
      icon: ShoppingBag,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total order value",
      value: formatCurrency(totalValue),
      icon: Wallet,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed orders",
      value: completedOrders.length,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Completion rate",
      value: `${completionRate}%`,
      icon: ChartNoAxesColumnIncreasing,
      iconStyle: "bg-violet-50 text-violet-600",
    },
    {
      label: "Collected in selected period",
      value: formatCurrency(collectedForCurrentOrders),
      icon: CreditCard,
      iconStyle: "bg-teal-50 text-teal-600",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Order Management"
          description="Track order fulfillment, linked deals, payment collections and delivery dates."
          action={{
            label: "Export CSV",
            icon: Download,
            onClick: handleExport,
          }}
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {summaryCards.map(({ label, value, icon: Icon, iconStyle }) => (
            <article
              key={label}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                >
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900">
                {value}
              </p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-slate-900">
              Order register
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Each order links to its deal. Collected amounts reflect completed
              payments within the selected date range.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            pageSize={8}
            searchPlaceholder="Search order, deal, service, owner or status..."
            emptyTitle="No orders found"
            emptyDescription="Try changing the date range or selected filters."
          />
        </section>
      </div>
    </AppLayout>
  );
}
