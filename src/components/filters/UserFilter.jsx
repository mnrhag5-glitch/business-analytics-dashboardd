
import { Users } from "lucide-react";
import { users } from "../../data/users";

export default function UserFilter({ value = "all", onChange }) {
  return (
    <label className="flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10">
      <Users
        size={16}
        className="shrink-0 text-slate-400"
        aria-hidden="true"
      />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter by team member"
        className="h-full min-w-0 flex-1 cursor-pointer bg-transparent text-sm text-slate-700 outline-none"
      >
        <option value="all">All team members</option>

        {users
          .filter((user) => user.active)
          .map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
      </select>
    </label>
  );
}
