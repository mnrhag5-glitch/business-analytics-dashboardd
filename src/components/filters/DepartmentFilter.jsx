
import { Building2 } from "lucide-react";
import { departments } from "../../data/departments";

export default function DepartmentFilter({ value = "all", onChange }) {
  return (
    <label className="flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10">
      <Building2
        size={16}
        className="shrink-0 text-slate-400"
        aria-hidden="true"
      />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter by department"
        className="h-full min-w-0 flex-1 cursor-pointer bg-transparent text-sm text-slate-700 outline-none"
      >
        <option value="all">All departments</option>

        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>
    </label>
  );
}
