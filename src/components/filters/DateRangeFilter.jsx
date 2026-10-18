
import { CalendarDays } from "lucide-react";
import { DATE_PRESETS } from "../../utils/dateUtils";

const selectClass =
  "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

const dateInputClass =
  "h-10 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";


function DateField({ label, value, onChange }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">
        {label}
      </span>


<input
  type="date"
  value={value || ""}
  onChange={(event) => onChange(event.target.value)}
  aria-label={label}
  className={dateInputClass}
/>

    </label>
  );
}


export default function DateRangeFilter({
  preset,
  onPresetChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
      <CalendarDays
        size={17}
        className="ml-1 shrink-0 text-slate-400"
        aria-hidden="true"
      />

      <select
        value={preset}
        onChange={(event) => onPresetChange(event.target.value)}
        aria-label="Filter by date range"
        className={`${selectClass} max-w-full`}
      >
        {DATE_PRESETS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {preset === "custom" && (
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-2">
          <DateField
            label="Start date"
            value={customStart}
            onChange={onCustomStartChange}
          />

          <span className="pb-3 text-xs font-medium text-slate-400">
            to
          </span>

          <DateField
            label="End date"
            value={customEnd}
            onChange={onCustomEndChange}
          />
        </div>
      )}
    </div>
  );
}
