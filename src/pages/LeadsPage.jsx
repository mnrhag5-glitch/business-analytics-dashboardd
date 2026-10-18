
import { useMemo } from "react";
import { Download, Users, UserCheck, CheckCircle2, Wallet } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DataTable from "../components/tables/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { users } from "../data/users";
import { formatCurrency, formatDate } from "../utils/formatters";
import { exportToCSV } from "../utils/exportUtils";

const getOwnerName = (id) =>
  users.find((user) => user.id === id)?.name ?? "—";

export default function LeadsPage() {
  const filters = useDashboardFilters();
  const analytics = useAnalytics(filters);

  const rows = useMemo(
    () =>
      [...analytics.currentLeads].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [analytics.currentLeads],
  );

  const qualifiedCount = rows.filter(
    (lead) => lead.qualification === "Qualified",
  ).length;

  const convertedCount = rows.filter(
    (lead) => lead.status === "Converted",
  ).length;

  const pipelineValue = rows.reduce(
    (total, lead) => total + (Number(lead.estimatedValue) || 0),
    0,
  );

  const columns = [
    {
      header: "Lead",
      accessor: "company",
      searchValue: (row) => `${row.company} ${row.id}`,
      render: (row) => (
        <div className="min-w-36">
          <p className="font-semibold text-slate-800">{row.company}</p>
          <p className="mt-1 text-xs text-slate-400">{row.id}</p>
        </div>
      ),
    },
    { header: "Contact", accessor: "contactName" },
    { header: "Source", accessor: "source" },
    { header: "Service", accessor: "service" },
    {
      header: "Qualification",
      accessor: "qualification",
      render: (row) => <StatusBadge status={row.qualification} />,
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Est. value",
      accessor: "estimatedValue",
      render: (row) => (
        <span className="whitespace-nowrap font-semibold tabular-nums text-slate-800">
          {formatCurrency(row.estimatedValue)}
        </span>
      ),
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
  ];

  function handleExport() {
    exportToCSV(
      rows.map((lead) => ({
        ID: lead.id,
        Company: lead.company,
        Contact: lead.contactName,
        Email: lead.email,
        Phone: lead.phone,
        Source: lead.source,
        Service: lead.service,
        Qualification: lead.qualification,
        Status: lead.status,
        EstimatedValue: lead.estimatedValue,
        Owner: getOwnerName(lead.assignedTo),
        CreatedAt: lead.createdAt,
      })),
      "leads-report.csv",
    );
  }

  const summaryCards = [
    {
      label: "Total matching leads",
      value: rows.length,
      icon: Users,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Qualified leads",
      value: qualifiedCount,
      icon: UserCheck,
      iconStyle: "bg-violet-50 text-violet-600",
    },
    {
      label: "Converted leads",
      value: convertedCount,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Estimated pipeline",
      value: formatCurrency(pipelineValue),
      icon: Wallet,
      iconStyle: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Lead Management"
          description="Review lead quality, acquisition sources, ownership and pipeline status."
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
              All leads
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Records follow the selected date, user and department filters.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            pageSize={8}
            searchPlaceholder="Search company, contact, source or service..."
            emptyTitle="No leads found"
            emptyDescription="Try another date range or change your filters."
          />
        </section>
      </div>
    </AppLayout>
  );
}
