import type { AvailabilityDTO } from "@/types/api";

/**
 * Disponibilidad de ejemplo: horas de inicio ocupadas del día (7..20).
 * Es determinista (depende del espacio y la fecha) para que sea reproducible.
 * Con la API real se reemplaza por fetch(`/api/spaces/${id}/availability?date=`).
 */
export async function getAvailability(
  spaceId: string,
  date: string,
): Promise<AvailabilityDTO> {
  const seed = [...`${spaceId}${date}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const first = 7 + (seed % 10); // 7..16
  return { date, busyHours: [first, first + 1, first + 4].filter((hour) => hour <= 20) };
}
