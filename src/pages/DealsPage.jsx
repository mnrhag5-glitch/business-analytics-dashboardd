
import { useMemo } from "react";
import {
  Download,
  Handshake,
  Wallet,
  Trophy,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DataTable from "../components/tables/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import ProgressBar from "../components/common/ProgressBar";
import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { leads } from "../data/leads";
import { users } from "../data/users";
import { formatCurrency, formatDate } from "../utils/formatters";
import { exportToCSV } from "../utils/exportUtils";

const getOwnerName = (id) =>
  users.find((user) => user.id === id)?.name ?? "—";

const getClientName = (leadId) =>
  leads.find((lead) => lead.id === leadId)?.name ?? "Unknown client";

export default function DealsPage() {
  const filters = useDashboardFilters();
  const analytics = useAnalytics(filters);

  const rows = useMemo(
    () =>
      [...analytics.currentDeals].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [analytics.currentDeals],
  );

  const wonDeals = rows.filter((deal) => deal.status === "Won");

  const lostDeals = rows.filter((deal) => deal.status === "Lost");

  const openDeals = rows.filter(
    (deal) => !["Won", "Lost"].includes(deal.status),
  );

  const openPipelineValue = openDeals.reduce(
    (total, deal) => total + (Number(deal.value) || 0),
    0,
  );

  const wonValue = wonDeals.reduce(
    (total, deal) => total + (Number(deal.value) || 0),
    0,
  );

  const lostValue = lostDeals.reduce(
    (total, deal) => total + (Number(deal.value) || 0),
    0,
  );

  const averageProgress = rows.length
    ? Math.round(
        rows.reduce(
          (total, deal) => total + (Number(deal.progress) || 0),
          0,
        ) / rows.length,
      )
    : 0;

  const columns = [
    {
      header: "Deal",
      accessor: "id",
      searchValue: (row) => `${row.id} ${row.name ?? ""} ${row.service}`,
      render: (row) => (
        <div className="min-w-36">
          <p className="font-semibold text-slate-800">
            {row.name || row.id}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {row.id} · {row.service}
          </p>
        </div>
      ),
    },
    {
      header: "Client",
      accessor: "leadId",
      searchValue: (row) =>
        `${row.leadId} ${getClientName(row.leadId)}`,
      render: (row) => (
        <div className="min-w-32">
          <p className="font-medium text-slate-800">
            {getClientName(row.leadId)}
          </p>
          <p className="mt-1 text-xs text-slate-400">{row.leadId}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => row.category || "—",
    },
    {
      header: "Owner",
      accessor: "assignedTo",
      searchValue: (row) => getOwnerName(row.assignedTo),
      render: (row) => getOwnerName(row.assignedTo),
    },
    {
      header: "Priority",
      accessor: "priority",
      render: (row) => <StatusBadge status={row.priority} />,
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
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
      header: "Deal value",
      accessor: "value",
      render: (row) => (
        <span className="whitespace-nowrap font-semibold tabular-nums text-slate-800">
          {formatCurrency(row.value)}
        </span>
      ),
    },
    {
      header: "Expected close",
      accessor: "expectedCloseDate",
      render: (row) =>
        row.expectedCloseDate ? formatDate(row.expectedCloseDate) : "—",
    },
  ];

  function handleExport() {
    exportToCSV(
      rows.map((deal) => ({
        ID: deal.id,
        DealName: deal.name,
        LeadID: deal.leadId,
        Client: getClientName(deal.leadId),
        QuotationID: deal.quotationId,
        Service: deal.service,
        Category: deal.category,
        Priority: deal.priority,
        Status: deal.status,
        Progress: deal.progress,
        Value: deal.value,
        Owner: getOwnerName(deal.assignedTo),
        CreatedAt: deal.createdAt,
        ExpectedCloseDate: deal.expectedCloseDate,
      })),
      "deals-report.csv",
    );
  }

  const summaryCards = [
    {
      label: "Total deals",
      value: rows.length,
      icon: Handshake,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Open pipeline",
      value: formatCurrency(openPipelineValue),
      icon: Wallet,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Won deal value",
      value: formatCurrency(wonValue),
      icon: Trophy,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Average progress",
      value: `${averageProgress}%`,
      icon: ChartNoAxesColumnIncreasing,
      iconStyle: "bg-violet-50 text-violet-600",
    },
    {
      label: "Lost deal value",
      value: formatCurrency(lostValue),
      icon: Wallet,
      iconStyle: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Deals & Revenue"
          description="Monitor the sales pipeline, deal values, service categories, priority and expected close dates."
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
              Deal pipeline
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search deals by name, client, service, category, owner or status.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            pageSize={8}
            searchPlaceholder="Search deal, client, owner or status..."
            emptyTitle="No deals found"
            emptyDescription="Try changing the date range or selected filters."
          />
        </section>
      </div>
    </AppLayout>
  );
}
