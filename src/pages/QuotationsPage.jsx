
import { useMemo } from "react";
import { Download, FileText, CheckCircle2, Wallet, BadgeCheck } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DataTable from "../components/tables/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { leads } from "../data/leads";
import { users } from "../data/users";
import { formatCurrency, formatDate } from "../utils/formatters";
import { exportToCSV } from "../utils/exportUtils";

const getOwnerName = (id) =>
  users.find((user) => user.id === id)?.name ?? "—";

const getLead = (id) => leads.find((lead) => lead.id === id);

export default function QuotationsPage() {
  const filters = useDashboardFilters();
  const analytics = useAnalytics(filters);

  const rows = useMemo(
    () =>
      [...analytics.currentQuotations].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [analytics.currentQuotations],
  );

  const acceptedRows = rows.filter(
    (quotation) => quotation.status === "Accepted",
  );

  const totalQuotedValue = rows.reduce(
    (total, quotation) => total + (Number(quotation.amount) || 0),
    0,
  );

  const acceptedValue = acceptedRows.reduce(
    (total, quotation) => total + (Number(quotation.amount) || 0),
    0,
  );

  const columns = [
    {
      header: "Quotation",
      accessor: "id",
      searchValue: (row) => `${row.id} ${row.version}`,
      render: (row) => (
        <div className="min-w-28">
          <p className="font-semibold text-slate-800">{row.id}</p>
          <p className="mt-1 text-xs text-slate-400">
            Version {row.version}
          </p>
        </div>
      ),
    },
    {
      header: "Lead / Client",
      accessor: "leadId",
      searchValue: (row) => {
        const lead = getLead(row.leadId);
        return `${row.leadId} ${lead?.company ?? ""}`;
      },
      render: (row) => {
        const lead = getLead(row.leadId);

        return (
          <div className="min-w-32">
            <p className="font-medium text-slate-800">
              {lead?.company ?? "Unknown client"}
            </p>
            <p className="mt-1 text-xs text-slate-400">{row.leadId}</p>
          </div>
        );
      },
    },
    { header: "Service", accessor: "service" },
    {
      header: "Category",
      accessor: "category",
      render: (row) => row.category || "—",
    },
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
      header: "Owner",
      accessor: "assignedTo",
      searchValue: (row) => getOwnerName(row.assignedTo),
      render: (row) => getOwnerName(row.assignedTo),
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: "Valid until",
      accessor: "validUntil",
      render: (row) => formatDate(row.validUntil),
    },
  ];

  function handleExport() {
    exportToCSV(
      rows.map((quotation) => ({
        ID: quotation.id,
        LeadID: quotation.leadId,
        Client: getLead(quotation.leadId)?.company ?? "",
        Service: quotation.service,
        Category: quotation.category ?? "",
        Amount: quotation.amount,
        Status: quotation.status,
        Version: quotation.version,
        Owner: getOwnerName(quotation.assignedTo),
        CreatedAt: quotation.createdAt,
        ValidUntil: quotation.validUntil,
      })),
      "quotations-report.csv",
    );
  }

  const summaryCards = [
    {
      label: "Total quotations",
      value: rows.length,
      icon: FileText,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total quoted value",
      value: formatCurrency(totalQuotedValue),
      icon: Wallet,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Accepted quotations",
      value: acceptedRows.length,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Accepted value",
      value: formatCurrency(acceptedValue),
      icon: BadgeCheck,
      iconStyle: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Quotation Analytics"
          description="Track quotation values, service categories, acceptance and conversion opportunities."
          action={{
            label: "Export CSV",
            icon: Download,
            onClick: handleExport,
          }}
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, iconStyle }) => (
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
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-slate-900">
              Quotation register
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search quotations and compare their status, amount and client.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            pageSize={8}
            searchPlaceholder="Search quotation, client, service or status..."
            emptyTitle="No quotations found"
            emptyDescription="Try another date range or change your filters."
          />
        </section>
      </div>
    </AppLayout>
  );
}
