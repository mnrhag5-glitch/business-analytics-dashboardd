
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { formatPercentage } from "../../utils/formatters";

export default function ComparisonLabel({
  value = 0,
  label = "vs previous period",
  inverse = false,
}) {
  const isNew =
    typeof value === "object" &&
    value !== null &&
    value.isNew === true;

  const numericValue =
    typeof value === "object" && value !== null
      ? Number(value.value)
      : Number(value);

  const safeValue = Number.isFinite(numericValue)
    ? numericValue
    : 0;

  const isPositive = safeValue > 0;
  const isNegative = safeValue < 0;
  const isGood = inverse ? isNegative : isPositive;

  const tone =
    isPositive || isNegative
      ? isGood
        ? "text-emerald-600"
        : "text-rose-600"
      : "text-slate-500";

  const Icon = isPositive
    ? ArrowUpRight
    : isNegative
      ? ArrowDownRight
      : ArrowRight;

  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1 text-xs font-medium ${tone}`}
      title={isNew ? "No previous-period baseline" : label}
    >
      <Icon size={14} className="shrink-0" />

      <strong className="font-semibold tabular-nums">
        {isNew
          ? "New"
          : formatPercentage(Math.abs(safeValue))}
      </strong>

      <span className="truncate">
        {isNew ? "no previous-period baseline" : label}
      </span>
    </span>
  );
}
