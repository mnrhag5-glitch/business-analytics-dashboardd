
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../../app/ThemeContext";

export default function Header() {
  const [search, setSearch] = useState("");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const today = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    window.dispatchEvent(
      new CustomEvent("dashboard-search", {
        detail: { query },
      }),
    );
  }

  return (
    <header
      className={`sticky top-0 z-30 hidden h-[72px] items-center justify-between gap-4 border-b px-5 backdrop-blur sm:flex sm:px-6 xl:px-8 ${
        isDark
          ? "border-slate-700 bg-slate-900/95"
          : "border-slate-200 bg-white/95"
      }`}
    >
      <form
        onSubmit={handleSearch}
        role="search"
        className={`flex w-full max-w-md items-center gap-3 rounded-xl border px-3.5 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 ${
          isDark
            ? "border-slate-700 bg-slate-800 focus-within:bg-slate-800"
            : "border-slate-200 bg-slate-50 focus-within:bg-white"
        }`}
      >
        <Search
          size={18}
          className="shrink-0 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search dashboard..."
          aria-label="Search dashboard"
          className={`h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 ${
            isDark ? "text-slate-100" : "text-slate-800"
          }`}
        />

        <span
          className={`hidden rounded-md border px-1.5 py-1 text-[10px] md:inline ${
            isDark
              ? "border-slate-600 bg-slate-700 text-slate-300"
              : "border-slate-200 bg-white text-slate-400"
          }`}
        >
          Search
        </span>
      </form>

      <div className="flex shrink-0 items-center gap-3 lg:gap-5">
        <div
          className={`hidden items-center gap-2 text-sm md:flex ${
            isDark ? "text-slate-300" : "text-slate-500"
          }`}
        >
          <CalendarDays
            size={17}
            className="text-slate-400"
          />
          <span>{today}</span>
        </div>

        <div
          className={`h-8 w-px ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}
        />

        <button
          type="button"
          onClick={toggleTheme}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${
            isDark
              ? "text-amber-300 hover:bg-slate-800 hover:text-amber-200"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          type="button"
          className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${
            isDark
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
          aria-label="Notifications"
          title="Notifications"
          onClick={() => {
            window.dispatchEvent(
              new Event("dashboard-notifications"),
            );
          }}
        >
          <Bell size={19} />
          <span
            className={`absolute right-2.5 top-2 h-2 w-2 rounded-full border-2 ${
              isDark
                ? "border-slate-900 bg-indigo-400"
                : "border-white bg-indigo-500"
            }`}
          />
        </button>

        <div
          className={`flex items-center gap-3 border-l pl-4 ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-1 ${
              isDark
                ? "bg-indigo-950 text-indigo-300 ring-indigo-800"
                : "bg-indigo-100 text-indigo-700 ring-indigo-200"
            }`}
          >
            AD
          </div>

          <div className="hidden lg:block">
            <p
              className={`text-sm font-semibold ${
                isDark ? "text-slate-100" : "text-slate-800"
              }`}
            >
              Admin
            </p>
            <p
              className={`mt-0.5 text-xs ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Workspace owner
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
