import { badRequest } from "@/lib/errors";
import { businessHourOf, CLOSE_HOUR, HOUR_MS, OPEN_HOUR } from "@/lib/time";

export const MIN_HOURS = 1;
export const MAX_HOURS = 4;
export const MAX_ADVANCE_DAYS = 30;
export const MIN_CANCEL_NOTICE_HOURS = 2;
export const MAX_FUTURE_RESERVATIONS = 3;

export function assertValidSlot(startsAt: Date, hours: number, now: Date): void {
  if (!Number.isInteger(hours) || hours < MIN_HOURS || hours > MAX_HOURS) {
    throw badRequest("INVALID_DURATION", "La reserva dura entre 1 y 4 horas completas");
  }
  if (startsAt.getTime() % HOUR_MS !== 0) {
    throw badRequest("INVALID_START_TIME", "La reserva debe empezar en una hora exacta");
  }

  const startHour = businessHourOf(startsAt);
  if (startHour < OPEN_HOUR || startHour + hours > CLOSE_HOUR) {
    throw badRequest("OUTSIDE_BUSINESS_HOURS", "Solo se puede reservar entre las 07:00 y las 21:00");
  }
  if (startsAt.getTime() <= now.getTime()) {
    throw badRequest("RESERVATION_IN_PAST", "No se puede reservar en el pasado");
  }
  if (startsAt.getTime() > now.getTime() + MAX_ADVANCE_DAYS * 24 * HOUR_MS) {
    throw badRequest("TOO_FAR_AHEAD", "No se puede reservar con más de 30 días de anticipación");
  }
}

export function calculateTotalPrice(pricePerHour: number, hours: number): number {
  return pricePerHour * hours;
}

export function canUserCancel(startsAt: Date, now: Date): boolean {
  return startsAt.getTime() - now.getTime() >= MIN_CANCEL_NOTICE_HOURS * HOUR_MS;
}