import { ApiError } from "@/mocks/api-error";
import { getSpaces } from "@/mocks/spaces";
import type { ReservationDTO } from "@/types/api";

const HOUR_MS = 60 * 60 * 1000;
const MIN_CANCEL_NOTICE_HOURS = 2; // RN-10

let store: ReservationDTO[] | null = null;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Reservas de ejemplo con fechas relativas a "ahora", para que siempre haya futuras. */
async function seed(): Promise<ReservationDTO[]> {
  const spaces = await getSpaces();
  const now = Date.now();
  const startOfNextHour = Math.ceil(now / HOUR_MS) * HOUR_MS;

  // [índice de espacio, horas desde ahora, duración, cancelada]
  const plan: [number, number, number, boolean][] = [
    [1, 1, 2, false], // empieza en ~1 h: ya no se puede cancelar (RN-10)
    [0, 26, 4, false],
    [2, -150, 1, true],
  ];

  return plan.flatMap(([spaceIndex, offsetHours, hours, cancelled], i) => {
    const space = spaces[spaceIndex];
    if (!space) return [];
    const startsAt = new Date(startOfNextHour + (offsetHours - 1) * HOUR_MS);
    const endsAt = new Date(startsAt.getTime() + hours * HOUR_MS);
    return [
      {
        id: `mock-reservation-${i + 1}`,
        userId: "mock-user",
        spaceId: space.id,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        totalPrice: hours * space.pricePerHour,
        status: cancelled ? "cancelled" : "confirmed",
        cancelledAt: cancelled ? startsAt.toISOString() : null,
        createdAt: new Date(now - 24 * HOUR_MS).toISOString(),
        space: { id: space.id, name: space.name, type: space.type, imageUrl: space.imageUrl },
      } satisfies ReservationDTO,
    ];
  });
}

async function getStore(): Promise<ReservationDTO[]> {
  store ??= await seed();
  return store;
}

// Funciones de acceso: con la API real pasan a fetch("/api/reservations") y
// fetch(`/api/reservations/${id}/cancel`, { method: "POST" }).

/** Reservas del usuario, de la más próxima a la más antigua. */
export async function getMyReservations(): Promise<ReservationDTO[]> {
  await delay(400);
  const reservations = await getStore();
  return [...reservations].sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export async function cancelReservation(id: string): Promise<ReservationDTO> {
  await delay(400);
  const reservations = await getStore();
  const target = reservations.find((reservation) => reservation.id === id);
  if (!target) {
    throw new ApiError(404, { error: { code: "NOT_FOUND", message: "La reserva no existe" } });
  }
  if (new Date(target.startsAt).getTime() - Date.now() < MIN_CANCEL_NOTICE_HOURS * HOUR_MS) {
    throw new ApiError(409, {
      error: {
        code: "CANCELLATION_TOO_LATE",
        message: "Solo puedes cancelar hasta 2 horas antes del inicio",
      },
    });
  }
  // Se reemplaza el objeto (no se muta): así swr detecta que los datos cambiaron.
  const cancelled: ReservationDTO = {
    ...target,
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
  };
  store = reservations.map((reservation) => (reservation.id === id ? cancelled : reservation));
  return cancelled;
}
