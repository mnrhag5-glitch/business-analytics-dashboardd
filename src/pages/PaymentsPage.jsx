
import { useMemo } from "react";
import {
  Download,
  Wallet,
  CheckCircle2,
  Clock3,
  CircleX,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DataTable from "../components/tables/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { orders } from "../data/orders";
import { deals } from "../data/deals";
import { formatCurrency, formatDate } from "../utils/formatters";
import { exportToCSV } from "../utils/exportUtils";

const getOrder = (id) => orders.find((order) => order.id === id);
const getDeal = (id) => deals.find((deal) => deal.id === id);

export default function PaymentsPage() {
  const filters = useDashboardFilters();
  const analytics = useAnalytics(filters);

  const rows = useMemo(
    () =>
      [...analytics.currentPayments].sort((a, b) =>
        b.paymentDate.localeCompare(a.paymentDate),
      ),
    [analytics.currentPayments],
  );

  const completed = rows.filter(
    (payment) => payment.status === "Completed",
  );
  const pending = rows.filter((payment) => payment.status === "Pending");
  const failed = rows.filter((payment) => payment.status === "Failed");

  const sumAmounts = (payments) =>
    payments.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0),
      0,
    );

  const columns = [
    {
      header: "Payment",
      accessor: "id",
      searchValue: (row) => `${row.id} ${row.transactionId ?? ""}`,
      render: (row) => (
        <div className="min-w-32">
          <p className="font-semibold text-slate-800">{row.id}</p>
          <p className="mt-1 text-xs text-slate-400">
            {row.transactionId || "No transaction reference"}
          </p>
        </div>
      ),
    },
    {
      header: "Order",
      accessor: "orderId",
      searchValue: (row) => {
        const order = getOrder(row.orderId);
        return `${row.orderId} ${order?.orderNumber ?? ""}`;
      },
      render: (row) => {
        const order = getOrder(row.orderId);

        return (
          <div className="min-w-28">
            <p className="font-medium text-slate-800">
              {order?.orderNumber || row.orderId}
            </p>
            <p className="mt-1 text-xs text-slate-400">{row.dealId}</p>
          </div>
        );
      },
    },
    {
      header: "Client deal",
      accessor: "dealId",
      searchValue: (row) => {
        const deal = getDeal(row.dealId);
        return `${row.dealId} ${deal?.service ?? ""}`;
      },
      render: (row) => getDeal(row.dealId)?.service || "—",
    },
    { header: "Method", accessor: "method" },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="whitespace-nowrap font-semibold tabular-nums text-slate-800">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Payment date",
      accessor: "paymentDate",
      render: (row) => formatDate(row.paymentDate),
    },
  ];

  function handleExport() {
    exportToCSV(
      rows.map((payment) => ({
        PaymentID: payment.id,
        OrderID: payment.orderId,
        DealID: payment.dealId,
        Method: payment.method,
        Amount: payment.amount,
        Status: payment.status,
        PaymentDate: payment.paymentDate,
        TransactionID: payment.transactionId ?? "",
      })),
      "payments-report.csv",
    );
  }

  const summaryCards = [
    {
      label: "Payment records",
      value: rows.length,
      icon: Wallet,
      iconStyle: "bg-indigo-50 text-indigo-600",
      detail: null,
    },
    {
      label: "Collected amount",
      value: formatCurrency(sumAmounts(completed)),
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
      detail: `${completed.length} completed`,
    },
    {
      label: "Pending payments",
      value: pending.length,
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-600",
      detail: formatCurrency(sumAmounts(pending)),
    },
    {
      label: "Failed payments",
      value: failed.length,
      icon: CircleX,
      iconStyle: "bg-rose-50 text-rose-600",
      detail: formatCurrency(sumAmounts(failed)),
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Payments & Collections"
          description="Review collection performance, pending payments, failed transactions and payment history."
          action={{
            label: "Export CSV",
            icon: Download,
            onClick: handleExport,
          }}
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, iconStyle, detail }) => (
            <article
              key={label}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900">
                {value}
              </p>
              {detail && (
                <p className="mt-1 text-xs text-slate-500">{detail}</p>
              )}
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-slate-900">
              Payment history
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Collection totals count completed payments only.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            pageSize={8}
            searchPlaceholder="Search payment, order, transaction or status..."
            emptyTitle="No payments found"
            emptyDescription="Try changing the date range or selected filters."
          />
        </section>
      </div>
    </AppLayout>
  );
}
