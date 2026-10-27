import { and, asc, count, eq, gt, lt, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { reservations, type Space, spaces } from "@/db/schema";
import { conflict, notFound } from "@/lib/errors";
import { CLOSE_HOUR, HOUR_MS, OPEN_HOUR, businessDayRange } from "@/lib/time";
import type { CreateSpaceBody, UpdateSpaceBody } from "@/lib/validation/spaces";
import type { AvailabilityDTO, SpaceType } from "@/types/api";

interface ListFilters {
  type?: SpaceType;
  includeInactive: boolean;
}

export async function listSpaces({ type, includeInactive }: ListFilters): Promise<Space[]> {
  const conditions: SQL[] = [];
  if (!includeInactive) {
    conditions.push(eq(spaces.isActive, true));
  }
  if (type) {
    conditions.push(eq(spaces.type, type));
  }
  return await db
    .select()
    .from(spaces)
    .where(and(...conditions))
    .orderBy(asc(spaces.type), asc(spaces.name));
}

export async function getSpace(id: string, includeInactive: boolean): Promise<Space> {
  const rows = await db.select().from(spaces).where(eq(spaces.id, id)).limit(1);
  const space = rows[0];
  if (!space || (!space.isActive && !includeInactive)) {
    throw notFound("Espacio no encontrado");
  }
  return space;
}

export async function createSpace(input: CreateSpaceBody): Promise<Space> {
  const [space] = await db.insert(spaces).values(input).returning();
  return space;
}

export async function updateSpace(id: string, input: UpdateSpaceBody): Promise<Space> {
  const updated = await db.update(spaces).set(input).where(eq(spaces.id, id)).returning();
  const space = updated[0];
  if (!space) {
    throw notFound("Espacio no encontrado");
  }
  return space;
}

export async function deactivateSpace(id: string): Promise<Space> {
  return await db.transaction(async (tx) => {
    const locked = await tx.select().from(spaces).where(eq(spaces.id, id)).for("update");
    const space = locked[0];
    if (!space) {
      throw notFound("Espacio no encontrado");
    }
    if (!space.isActive) {
      return space;
    }

    const rows = await tx
      .select({ total: count() })
      .from(reservations)
      .where(
        and(
          eq(reservations.spaceId, id),
          eq(reservations.status, "confirmed"),
          gt(reservations.startsAt, new Date()),
        ),
      );
    const futureReservations = rows[0]?.total ?? 0;
    if (futureReservations > 0) {
      throw conflict(
        "SPACE_HAS_FUTURE_RESERVATIONS",
        "No puedes desactivar un espacio con reservas futuras confirmadas",
        { futureReservations },
      );
    }

    const updated = await tx
      .update(spaces)
      .set({ isActive: false })
      .where(eq(spaces.id, id))
      .returning();
    return updated[0];
  });
}

export async function getAvailability(spaceId: string, date: string): Promise<AvailabilityDTO> {
  await getSpace(spaceId, false);
  const { start, end } = businessDayRange(date);

  const booked = await db
    .select({ startsAt: reservations.startsAt, endsAt: reservations.endsAt })
    .from(reservations)
    .where(
      and(
        eq(reservations.spaceId, spaceId),
        eq(reservations.status, "confirmed"),
        lt(reservations.startsAt, end),
        gt(reservations.endsAt, start),
      ),
    );

  const busyHours: number[] = [];
  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour += 1) {
    const slotStart = start.getTime() + hour * HOUR_MS;
    const slotEnd = slotStart + HOUR_MS;
    if (booked.some((r) => r.startsAt.getTime() < slotEnd && r.endsAt.getTime() > slotStart)) {
      busyHours.push(hour);
    }
  }
  return { date, busyHours };
}