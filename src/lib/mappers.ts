import type { Reservation, Space, User } from "@/db/schema";
import type { ReservationDTO, SpaceDTO, UserDTO } from "@/types/api";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toSpaceDTO(space: Space): SpaceDTO {
  return { ...space, createdAt: space.createdAt.toISOString() };
}

export interface ReservationWithSpace {
  reservation: Reservation;
  space: ReservationDTO["space"];
}

export function toReservationDTO({ reservation, space }: ReservationWithSpace): ReservationDTO {
  return {
    id: reservation.id,
    userId: reservation.userId,
    spaceId: reservation.spaceId,
    startsAt: reservation.startsAt.toISOString(),
    endsAt: reservation.endsAt.toISOString(),
    totalPrice: reservation.totalPrice,
    status: reservation.status,
    cancelledAt: reservation.cancelledAt?.toISOString() ?? null,
    createdAt: reservation.createdAt.toISOString(),
    space,
  };
}