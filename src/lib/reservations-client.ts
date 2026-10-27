import { apiFetch } from "@/lib/api-client";
import type { ReservationDTO, ReservationResponseDTO, ReservationsResponseDTO } from "@/types/api";

export async function fetchMyReservations(): Promise<ReservationDTO[]> {
  const { reservations } = await apiFetch<ReservationsResponseDTO>("/api/reservations");
  return reservations;
}

export async function cancelReservationRequest(id: string): Promise<ReservationDTO> {
  const { reservation } = await apiFetch<ReservationResponseDTO>(`/api/reservations/${id}/cancel`, {
    method: "POST",
  });
  return reservation;
}
