
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

export default function DataTable({
  columns = [],
  data = [],
  getRowId,
  pageSize = 6,
  searchable = true,
  searchPlaceholder = "Search records...",
  emptyTitle = "No records found",
  emptyDescription = "Try changing your filters or search query.",
  onRowClick,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = column.searchValue
          ? column.searchValue(row)
          : column.accessor
            ? row[column.accessor]
            : "";

        return String(value ?? "")
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    );
  }, [columns, data, query]);

  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0
      ? Math.floor(pageSize)
      : 6;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / safePageSize),
  );

  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * safePageSize;

  const visibleRows = filteredData.slice(
    startIndex,
    startIndex + safePageSize,
  );

  useEffect(() => {
    setPage((current) =>
      Math.min(current, Math.max(1, Math.ceil(filteredData.length / safePageSize))),
    );
  }, [filteredData.length, safePageSize]);

  function handleSearch(value) {
    setQuery(value);
    setPage(1);
  }

  const cellKey = (column) =>
    column.key ?? column.accessor ?? column.header;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {searchable && (
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 sm:max-w-sm">
            <Search
              size={16}
              className="shrink-0 text-slate-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <span className="text-xs font-medium text-slate-500">
            {filteredData.length}{" "}
            {filteredData.length === 1 ? "record" : "records"}
          </span>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {columns.map((column) => (
                <th
                  key={cellKey(column)}
                  scope="col"
                  className="whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((row, index) => {
              const rowId = getRowId
                ? getRowId(row)
                : row.id ?? index;

              return (
                <tr
                  key={rowId}
                  onClick={
                    onRowClick ? () => onRowClick(row) : undefined
                  }
                  className={
                    onRowClick
                      ? "cursor-pointer transition-colors hover:bg-indigo-50/40"
                      : "transition-colors hover:bg-slate-50/70"
                  }
                >
                  {columns.map((column) => (
                    <td
                      key={cellKey(column)}
                      className="px-5 py-4 text-sm text-slate-600"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor] ?? "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleRows.length === 0 && (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Inbox size={25} strokeWidth={1.5} />
            </div>

            <p className="text-sm font-semibold text-slate-800">
              {emptyTitle}
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              {emptyDescription}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <span className="text-xs text-slate-500">
          Showing{" "}
          {filteredData.length === 0 ? 0 : startIndex + 1}
          {"–"}
          {Math.min(startIndex + safePageSize, filteredData.length)}
          {" of "}
          {filteredData.length}
        </span>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage <= 1}
            onClick={() =>
              setPage((current) => Math.max(1, current - 1))
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="min-w-16 text-center text-xs font-medium tabular-nums text-slate-600">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            aria-label="Next page"
            disabled={safePage >= totalPages}
            onClick={() =>
              setPage((current) =>
                Math.min(totalPages, current + 1),
              )
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
