
const COLOR_STYLES = {
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  teal: "bg-teal-500",
  emerald: "bg-emerald-500",
  green: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  red: "bg-rose-500",
  sky: "bg-sky-500",
};

const SIZE_STYLES = {
  small: "h-1",
  medium: "h-1.5",
  large: "h-2.5",
};

export default function ProgressBar({
  value = 0,
  color = "indigo",
  showLabel = true,
  size = "medium",
}) {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue)
    ? Math.min(100, Math.max(0, numericValue))
    : 0;

  const trackSize = SIZE_STYLES[size] ?? SIZE_STYLES.medium;
  const fillColor = COLOR_STYLES[color] ?? COLOR_STYLES.indigo;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 ${trackSize}`}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Completion progress"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${fillColor}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>

      {showLabel && (
        <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-600">
          {Math.round(safeValue)}%
        </span>
      )}
    </div>
  );
}
