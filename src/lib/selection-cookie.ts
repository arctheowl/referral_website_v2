/** Client-only: read persisted lottery outcome from document.cookie. */
export function getClientSelectionOutcome(): "selected" | "rejected" | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie.split("; ").find((r) => r.startsWith("selection_outcome="));
  if (!row) return null;
  const value = row.split("=")[1];
  if (value === "selected" || value === "rejected") return value;
  return null;
}
