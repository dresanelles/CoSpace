"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/components/ui/space-card";
import { cn } from "@/lib/cn";
import { getAvailability } from "@/mocks/availability";
import type { CreateReservationInput, SpaceDTO } from "@/types/api";

// RN-01 / RN-02: duración 1-4 h y horario 07:00-21:00.
const OPEN_HOUR = 7;
const CLOSE_HOUR = 21;
const MAX_HOURS = 4;
const START_HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => OPEN_HOUR + i);
const DURATIONS = Array.from({ length: MAX_HOURS }, (_, i) => i + 1);

const pad = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

interface BookingWidgetProps {
  space: SpaceDTO;
  /** Fechas YYYY-MM-DD en hora de Bogotá, calculadas en el servidor (RN-03). */
  minDate: string;
  maxDate: string;
  /** Hora actual en Bogotá: hoy no se pueden reservar horas ya pasadas. */
  currentHour: number;
}

const slotButton =
  "rounded-lg py-2 text-center font-label text-xs transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-30";

export function BookingWidget({ space, minDate, maxDate, currentHour }: BookingWidgetProps) {
  const [date, setDate] = useState<string>(minDate);
  const [start, setStart] = useState<number | null>(null);
  const [hours, setHours] = useState<number>(1);

  const { data, isLoading } = useSWR(["availability", space.id, date], () =>
    getAvailability(space.id, date),
  );
  const busy = data?.busyHours ?? [];

  const isStartDisabled = (hour: number): boolean =>
    isLoading || busy.includes(hour) || (date === minDate && hour <= currentHour);

  // Mayor duración posible desde `from`: sin pasar de las 21:00 ni pisar una hora ocupada.
  const maxDurationFrom = (from: number): number => {
    let max = 0;
    for (const duration of DURATIONS) {
      const covered = Array.from({ length: duration }, (_, i) => from + i);
      if (from + duration > CLOSE_HOUR || covered.some((hour) => busy.includes(hour))) break;
      max = duration;
    }
    return max;
  };

  const selectStart = (hour: number): void => {
    setStart(hour);
    setHours((current) => Math.min(current, maxDurationFrom(hour)));
  };

  const changeDate = (value: string): void => {
    setDate(value);
    setStart(null); // las horas ocupadas cambian con el día
  };

  const total = hours * space.pricePerHour; // solo informativo: el servidor lo recalcula (RN-08)

  const reserve = (): void => {
    if (start === null) return;
    const input: CreateReservationInput = {
      spaceId: space.id,
      startsAt: new Date(`${date}T${pad(start)}:00-05:00`).toISOString(),
      hours,
    };
    // Todavía no hay API: cuando exista, aquí va el POST a /api/reservations.
    toast.success(`Reserva simulada: ${pad(start)} – ${pad(start + hours)}`, {
      description: JSON.stringify(input),
    });
  };

  return (
    <aside className="rounded-2xl bg-surface p-5 shadow-hard lg:sticky lg:top-6 lg:self-start">
      <p className="text-4xl font-extrabold">
        {formatPrice(space.pricePerHour)}{" "}
        <small className="font-label text-[13px] font-medium text-mute">/ hora</small>
      </p>

      <label htmlFor="date" className="mb-1.5 mt-4 block font-label text-[11px] uppercase tracking-wider text-mute">
        Fecha
      </label>
      <input
        id="date"
        type="date"
        value={date}
        min={minDate}
        max={maxDate}
        onChange={(event) => changeDate(event.target.value)}
        className="w-full rounded-[10px] bg-ink/10 px-3 py-2.5 text-[15px] text-ink"
      />

      <p className="mb-1.5 mt-4 font-label text-[11px] uppercase tracking-wider text-mute">
        Hora de inicio
      </p>
      <div role="group" aria-label="Hora de inicio" aria-busy={isLoading} className="grid grid-cols-5 gap-1.5">
        {START_HOURS.map((hour) => (
          <button
            key={hour}
            type="button"
            disabled={isStartDisabled(hour)}
            aria-pressed={start === hour}
            onClick={() => selectStart(hour)}
            className={cn(slotButton, start === hour ? "bg-lime text-on-pastel" : "bg-ink/10 text-ink")}
          >
            {pad(hour)}
          </button>
        ))}
      </div>

      <p className="mb-1.5 mt-4 font-label text-[11px] uppercase tracking-wider text-mute">Duración</p>
      <div role="group" aria-label="Duración" className="grid grid-cols-4 gap-1.5">
        {DURATIONS.map((duration) => (
          <button
            key={duration}
            type="button"
            disabled={start === null || duration > maxDurationFrom(start)}
            aria-pressed={start !== null && hours === duration}
            onClick={() => setHours(duration)}
            className={cn(
              slotButton,
              start !== null && hours === duration ? "bg-lime text-on-pastel" : "bg-ink/10 text-ink",
            )}
          >
            {duration} h
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-ink pt-4">
        <span className="font-label text-xs">
          {start === null ? "—" : `${pad(start)} – ${pad(start + hours)}`}
        </span>
        <b className="text-3xl">{start === null ? "$0" : formatPrice(total)}</b>
      </div>

      <Button className="mt-4 w-full" disabled={start === null} onClick={reserve}>
        Reservar
      </Button>
      <p className="mt-2.5 font-label text-[11px] text-mute">Cancelación gratis hasta 2 h antes.</p>
    </aside>
  );
}
