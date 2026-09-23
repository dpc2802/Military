/**
 * Utilidades de formato para COP y fechas
 * Todas las funciones usan el locale es-CO y zona America/Bogota
 */

/**
 * Formatea un número como moneda COP
 * Ej: 150000 → "$150.000"
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea una fecha en zona horaria de Bogotá
 * Ej: "22 sep 2026, 11:30 p.m."
 */
export function formatDateBogota(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(d);
}

/**
 * Genera el número de orden corto: SGB-XXXX
 * El número secuencial viene de la BD (serial), 
 * pero aquí lo formateamos con padding de 4 dígitos.
 */
export function generateOrderNumber(id: number): string {
  return `SGB-${String(id).padStart(4, "0")}`;
}

/**
 * Parsea un precio decimal de la BD (string) a número
 */
export function parsePrice(price: string | null | undefined): number {
  if (!price) return 0;
  return parseFloat(price);
}
