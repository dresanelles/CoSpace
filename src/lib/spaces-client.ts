import { apiFetch } from "@/lib/api-client";
import type {
  AvailabilityDTO,
  CreateReservationInput,
  ReservationDTO,
  ReservationResponseDTO,
} from "@/types/api";

export function fetchAvailability(spaceId: string, date: string): Promise<AvailabilityDTO> {
  return apiFetch<AvailabilityDTO>(`/api/spaces/${spaceId}/availability?date=${date}`);
}

export async function createReservationRequest(input: CreateReservationInput): Promise<ReservationDTO> {
  const { reservation } = await apiFetch<ReservationResponseDTO>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return reservation;
}
