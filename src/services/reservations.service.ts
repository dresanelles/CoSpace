import { and, count, desc, eq, gt, lt } from "drizzle-orm";
import { db } from "@/db";
import { reservations, spaces, users } from "@/db/schema";
import type { AccessTokenPayload } from "@/lib/auth/jwt";
import { conflict, forbidden, notFound } from "@/lib/errors";
import type { ReservationWithSpace } from "@/lib/mappers";
import { HOUR_MS } from "@/lib/time";
import type { CreateReservationBody } from "@/lib/validation/reservations";
import {
  assertValidSlot,
  calculateTotalPrice,
  canUserCancel,
  MAX_FUTURE_RESERVATIONS,
} from "./reservation-rules";

const spaceSummary = {
  id: spaces.id,
  name: spaces.name,
  type: spaces.type,
  imageUrl: spaces.imageUrl,
};

export async function listUserReservations(userId: string): Promise<ReservationWithSpace[]> {
  return await db
    .select({ reservation: reservations, space: spaceSummary })
    .from(reservations)
    .innerJoin(spaces, eq(reservations.spaceId, spaces.id))
    .where(eq(reservations.userId, userId))
    .orderBy(desc(reservations.startsAt));
}

export async function createReservation(
  userId: string,
  input: CreateReservationBody,
  idempotencyKey?: string,
): Promise<ReservationWithSpace> {
  const now = new Date();
  const startsAt = new Date(input.startsAt);
  assertValidSlot(startsAt, input.hours, now);
  const endsAt = new Date(startsAt.getTime() + input.hours * HOUR_MS);
  const storedKey = idempotencyKey ? `${userId}:${idempotencyKey}` : null;

  return await db.transaction(async (tx) => {
    // Bloqueo en orden fijo (usuario y luego espacio) para evitar interbloqueos.
    await tx.select({ id: users.id }).from(users).where(eq(users.id, userId)).for("update");

    if (storedKey) {
      const repeated = await tx
        .select({ reservation: reservations, space: spaceSummary })
        .from(reservations)
        .innerJoin(spaces, eq(reservations.spaceId, spaces.id))
        .where(eq(reservations.idempotencyKey, storedKey))
        .limit(1);
      if (repeated[0]) {
        return repeated[0];
      }
    }

    const spaceRows = await tx
      .select()
      .from(spaces)
      .where(eq(spaces.id, input.spaceId))
      .for("update");
    const space = spaceRows[0];
    if (!space) {
      throw notFound("Espacio no encontrado");
    }
    if (!space.isActive) {
      throw conflict("SPACE_INACTIVE", "El espacio está desactivado");
    }

    const overlaps = and(
      eq(reservations.status, "confirmed"),
      lt(reservations.startsAt, endsAt),
      gt(reservations.endsAt, startsAt),
    );

    const spaceBusy = await tx
      .select({ id: reservations.id })
      .from(reservations)
      .where(and(eq(reservations.spaceId, space.id), overlaps))
      .limit(1);
    if (spaceBusy.length > 0) {
      throw conflict("SPACE_UNAVAILABLE", "El espacio ya está reservado en ese horario");
    }

    const userBusy = await tx
      .select({ id: reservations.id })
      .from(reservations)
      .where(and(eq(reservations.userId, userId), overlaps))
      .limit(1);
    if (userBusy.length > 0) {
      throw conflict("USER_OVERLAP", "Ya tienes una reserva confirmada en ese horario");
    }

    const futureRows = await tx
      .select({ total: count() })
      .from(reservations)
      .where(
        and(
          eq(reservations.userId, userId),
          eq(reservations.status, "confirmed"),
          gt(reservations.startsAt, now),
        ),
      );
    if ((futureRows[0]?.total ?? 0) >= MAX_FUTURE_RESERVATIONS) {
      throw conflict(
        "RESERVATION_LIMIT_REACHED",
        "Solo puedes tener 3 reservas futuras confirmadas",
      );
    }

    const [reservation] = await tx
      .insert(reservations)
      .values({
        userId,
        spaceId: space.id,
        startsAt,
        endsAt,
        totalPrice: calculateTotalPrice(space.pricePerHour, input.hours),
        idempotencyKey: storedKey,
      })
      .returning();

    return {
      reservation,
      space: { id: space.id, name: space.name, type: space.type, imageUrl: space.imageUrl },
    };
  });
}

export async function cancelReservation(
  reservationId: string,
  session: AccessTokenPayload,
): Promise<ReservationWithSpace> {
  const rows = await db
    .select({ reservation: reservations, space: spaceSummary })
    .from(reservations)
    .innerJoin(spaces, eq(reservations.spaceId, spaces.id))
    .where(eq(reservations.id, reservationId))
    .limit(1);
  const found = rows[0];
  if (!found) {
    throw notFound("Reserva no encontrada");
  }

  const { reservation, space } = found;
  const isAdmin = session.role === "admin";
  if (reservation.userId !== session.sub && !isAdmin) {
    throw forbidden("Solo puedes cancelar tus propias reservas");
  }
  if (reservation.status === "cancelled") {
    throw conflict("ALREADY_CANCELLED", "La reserva ya está cancelada");
  }

  const now = new Date();
  if (!isAdmin && !canUserCancel(reservation.startsAt, now)) {
    throw conflict(
      "CANCELLATION_WINDOW_CLOSED",
      "Solo puedes cancelar hasta 2 horas antes del inicio",
    );
  }

  const updated = await db
    .update(reservations)
    .set({ status: "cancelled", cancelledAt: now })
    .where(and(eq(reservations.id, reservation.id), eq(reservations.status, "confirmed")))
    .returning();
  if (!updated[0]) {
    throw conflict("ALREADY_CANCELLED", "La reserva ya está cancelada");
  }
  return { reservation: updated[0], space };
}