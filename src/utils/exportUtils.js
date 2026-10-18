
export const exportToCSV = (rows, filename = "dashboard-export.csv") => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  const columns = [
    ...new Set(rows.flatMap((row) => Object.keys(row))),
  ];

  const escapeCell = (value) => {
    const text =
      value === null || value === undefined
        ? ""
        : String(value);

    // Prevent spreadsheet formula injection.
    const safeText = /^[\s]*[=+\-@]/.test(text)
      ? `'${text}`
      : text;

    return `"${safeText.replace(/"/g, '""')}"`;
  };

  const csv = [
    columns.map(escapeCell).join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCell(row[column])).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return true;
};
