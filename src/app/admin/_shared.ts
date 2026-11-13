// Shared utilities and types for the admin panel.

export type Fetcher<T> = (input: RequestInfo | URL, init?: RequestInit) => Promise<T>;

export async function fetcher<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* ignore parse errors */
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Permintaan gagal (${res.status})`;
    throw new Error(typeof message === "string" ? message : "Permintaan gagal");
  }
  return data as T;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(value?: string | Date | null): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// Convert an array of strings to a multi-line textarea value and back.
export function linesToArray(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

export function arrayToLines(arr?: string[] | null): string {
  return (arr || []).join("\n");
}

// Convert comma separated string -> array and back (for tags).
export function csvToArray(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function arrayToCsv(arr?: string[] | null): string {
  return (arr || []).join(", ");
}
