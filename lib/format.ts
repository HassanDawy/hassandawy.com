const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-04" -> "Apr 2026"; "present" -> "Present". Anything else is returned as is. */
export function formatMonth(value: unknown): string {
  const s = String(value ?? "");
  if (s === "present") return "Present";
  const m = /^(\d{4})-(\d{2})$/.exec(s);
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : s;
}

/** "Apr 2026 – May 2026", or just "Apr 2026" when start and end match. */
export function formatPeriod(start: unknown, end: unknown): string {
  const from = formatMonth(start);
  const to = formatMonth(end);
  if (!from) return to;
  return !to || to === from ? from : `${from} – ${to}`;
}

/** "2026-04-06" -> "April 6, 2026". */
export function formatDate(value: unknown): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ""));
  if (!m) return String(value ?? "");
  const long = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${long[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}
