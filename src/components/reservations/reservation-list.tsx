"use client";

import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import { LocalClock } from "@/components/reservations/local-clock";
import { ReservationRow } from "@/components/reservations/reservation-row";
import { useNow } from "@/components/reservations/use-now";
import { buttonClasses } from "@/components/ui/button";
import { ApiError } from "@/mocks/api-error";
import { cancelReservation, getMyReservations } from "@/mocks/reservations";

const MAX_ACTIVE = 3; // RN-06

// CSR: los datos se piden desde el navegador con swr, no desde el servidor.
export function ReservationList() {
  const { data, error, isLoading, mutate } = useSWR("/api/reservations", getMyReservations);
  const now = useNow();

  async function handleCancel(id: string): Promise<void> {
    try {
      await cancelReservation(id);
      toast.success("Reserva cancelada");
      await mutate(); // vuelve a pedir la lista
    } catch (cause) {
      toast.error(cause instanceof ApiError ? cause.message : "No se pudo cancelar la reserva");
    }
  }

  const active =
    data?.filter((item) => item.status === "confirmed" && new Date(item.startsAt).getTime() > now).length ?? 0;

  return (
    <>
      <p className="mb-6 mt-2.5 font-label text-sm text-mute">
        {data ? `${active} de ${MAX_ACTIVE} activas · ` : ""}hora local: <LocalClock />
      </p>

      {isLoading && (
        <ul aria-busy="true" aria-label="Cargando reservas">
          {[0, 1, 2].map((key) => (
            <li key={key} className="my-4 h-14 animate-pulse rounded-[10px] bg-ink/10" />
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel">
          No pudimos cargar tus reservas. Recarga la página.
        </p>
      )}

      {data && data.length === 0 && (
        <div className="flex flex-col items-start gap-4 py-6">
          <p>Aún no tienes reservas.</p>
          <Link href="/spaces" className={buttonClasses("solid", "md")}>
            Explorar espacios
          </Link>
        </div>
      )}

      {data && data.length > 0 && (
        <ul className="border-t border-ink/15">
          {data.map((reservation) => (
            <ReservationRow key={reservation.id} reservation={reservation} onCancel={handleCancel} />
          ))}
        </ul>
      )}
    </>
  );
}
