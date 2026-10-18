
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import ComparisonLabel from "./ComparisonLabel";

const ACCENTS = {
  indigo: {
    icon: "bg-indigo-50 text-indigo-600",
    bar: "bg-indigo-500",
  },
  blue: {
    icon: "bg-sky-50 text-sky-600",
    bar: "bg-sky-500",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    bar: "bg-violet-500",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    bar: "bg-amber-500",
  },
  teal: {
    icon: "bg-teal-50 text-teal-600",
    bar: "bg-teal-500",
  },
};

export default function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  accent = "indigo",
  description,
  inverse = false,
}) {
  const styles = ACCENTS[accent] ?? ACCENTS.indigo;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${styles.bar}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value ?? "—"}
          </p>
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
          >
            <Icon size={21} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="mt-4 flex min-h-6 flex-wrap items-center gap-x-2 gap-y-1">
        {change !== undefined && change !== null && (
          <ComparisonLabel
            value={change}
            inverse={inverse}
          />
        )}

        {description && (
          <span className="text-xs leading-5 text-slate-500">
            {description}
          </span>
        )}
      </div>
    </article>
  );
}
