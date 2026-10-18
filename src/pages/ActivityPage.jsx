
import { useMemo } from "react";
import { Activity, Users, CalendarClock } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/layout/PageHeader";
import DataTable from "../components/tables/DataTable";
import Avatar from "../components/common/Avatar";
import useAnalytics from "../hooks/useAnalytics";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { users } from "../data/users";
import { formatDateTime } from "../utils/formatters";

const getUser = (id) => users.find((user) => user.id === id);

export default function ActivityPage() {
  const filters = useDashboardFilters();
  const analytics = useAnalytics(filters);

  const rows = useMemo(
    () =>
      [...analytics.currentActivities].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [analytics.currentActivities],
  );

  const contributorCount = new Set(rows.map((row) => row.userId)).size;

  const columns = [
    {
      header: "Team member",
      accessor: "userId",
      searchValue: (row) => getUser(row.userId)?.name ?? row.userId,
      render: (row) => {
        const user = getUser(row.userId);

        return user ? (
          <Avatar
            name={user.name}
            initials={user.avatar}
            size="medium"
            showName
          />
        ) : (
          "—"
        );
      },
    },
    {
      header: "Activity",
      accessor: "title",
      searchValue: (row) =>
        `${row.title ?? ""} ${row.description ?? ""}`,
      render: (row) => (
        <div className="min-w-48 max-w-md">
          <p className="font-semibold text-slate-800">{row.title}</p>
          <p className="mt-1 whitespace-normal text-xs leading-5 text-slate-500">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      header: "Entity",
      accessor: "entityType",
      render: (row) => row.entityType || "—",
    },
    {
      header: "Reference",
      accessor: "entityId",
      render: (row) => (
        <span className="font-mono text-xs text-slate-600">
          {row.entityId || "—"}
        </span>
      ),
    },
    {
      header: "Date & time",
      accessor: "createdAt",
      render: (row) => (
        <span className="whitespace-nowrap text-slate-500">
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },
  ];

  const summaryCards = [
    {
      label: "Recorded activities",
      value: rows.length,
      icon: Activity,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Active contributors",
      value: contributorCount,
      icon: Users,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Latest recorded event",
      value: rows.length ? formatDateTime(rows[0].createdAt) : "—",
      icon: CalendarClock,
      iconStyle: "bg-violet-50 text-violet-600",
      compact: true,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="CRM Activity"
          description="A chronological view of recorded lead, quotation, deal and order updates."
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {summaryCards.map(({ label, value, icon: Icon, iconStyle, compact }) => (
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
              <p className={`mt-4 break-words font-bold tracking-tight text-slate-900 ${compact ? "text-base" : "text-2xl"}`}>
                {value}
              </p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-slate-900">
              Activity log
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Use search to find an activity by title, team member, entity or reference.
            </p>
          </div>

          <DataTable
            columns={columns}
            data={rows}
            getRowId={(row) => row.id}
            pageSize={10}
            searchPlaceholder="Search activity, team member, entity or reference..."
            emptyTitle="No activity found"
            emptyDescription="Try a different date range or filter selection."
          />
        </section>
      </div>
    </AppLayout>
  );
}
