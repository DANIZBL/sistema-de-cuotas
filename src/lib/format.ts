export function formatPrice(value: number | null | undefined) {
  return new Intl.NumberFormat("es-AR").format(Number(value || 0));
}

// "2026-05" -> "05-2026"
export function formatPeriod(period: string) {
  if (!period) {
    return "-";
  }

  const [year, month] = period.split("-");

  if (!year || !month) {
    return period;
  }

  return `${month.padStart(2, "0")}-${year}`;
}

export function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
