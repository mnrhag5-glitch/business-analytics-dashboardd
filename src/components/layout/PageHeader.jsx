
import { ArrowDownToLine } from "lucide-react";

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          disabled={!onAction}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowDownToLine size={17} aria-hidden="true" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
