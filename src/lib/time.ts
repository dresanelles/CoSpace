const BUSINESS_UTC_OFFSET_HOURS = -5; // America/Bogota, sin horario de verano
export const HOUR_MS = 60 * 60 * 1000;
export const OPEN_HOUR = 7;
export const CLOSE_HOUR = 21;

/** Rango UTC [inicio, fin) del día "YYYY-MM-DD" en hora de Bogotá. */
export function businessDayRange(date: string): { start: Date; end: Date } {
  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, -BUSINESS_UTC_OFFSET_HOURS));
  return { start, end: new Date(start.getTime() + 24 * HOUR_MS) };
}

/** Hora (0-23) de un instante, vista en la zona del negocio. */
export function businessHourOf(instant: Date): number {
  return (instant.getUTCHours() + BUSINESS_UTC_OFFSET_HOURS + 24) % 24;
}