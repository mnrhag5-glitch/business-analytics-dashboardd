
export default function ChartCard({
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      <div className="min-w-0">
        {children}
      </div>
    </section>
  );
}
