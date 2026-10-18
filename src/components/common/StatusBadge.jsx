
const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700 ring-blue-600/15",
  Qualified: "bg-violet-50 text-violet-700 ring-violet-600/15",
  Contacted: "bg-cyan-50 text-cyan-700 ring-cyan-600/15",
  Converted: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Lost: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Unqualified: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Sent: "bg-blue-50 text-blue-700 ring-blue-600/15",
  Draft: "bg-slate-100 text-slate-600 ring-slate-500/15",
  Revised: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Expired: "bg-slate-100 text-slate-600 ring-slate-500/15",
  Won: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-600/15",
  Negotiation: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Proposal: "bg-violet-50 text-violet-700 ring-violet-600/15",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Failed: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Cancelled: "bg-slate-100 text-slate-600 ring-slate-500/15",
  High: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Medium: "bg-amber-50 text-amber-700 ring-amber-600/15",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
};

export default function StatusBadge({ status, className = "" }) {
  const label = status || "Unknown";
  const style =
    STATUS_STYLES[label] ??
    "bg-slate-100 text-slate-600 ring-slate-500/15";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ring-1 ring-inset ${style} ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70"
      />
      <span className="truncate">{label}</span>
    </span>
  );
}
