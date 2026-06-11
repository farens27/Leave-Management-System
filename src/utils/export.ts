/**
 * CSV Export Utility
 * Converts an array of objects to a CSV file and triggers a browser download.
 */

export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);

  const escapeValue = (value: unknown): string => {
    const str = value === null || value === undefined ? "" : String(value);
    // Wrap in quotes if value contains commas, quotes, or newlines
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = headers.map(escapeValue).join(",");

  const rows = data.map((row) =>
    headers.map((header) => escapeValue(row[header])).join(",")
  );

  const csvContent = [headerRow, ...rows].join("\n");

  // Add BOM (Byte Order Mark) for Excel compatibility with UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
