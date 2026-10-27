"use client";

import { format } from "date-fns";
import { useNow } from "@/components/reservations/use-now";

/** Hora local del usuario. Antes de montar muestra "--:--" (igual en servidor y cliente). */
export function LocalClock() {
  const now = useNow();
  return <span>{now === 0 ? "--:--" : format(now, "HH:mm")}</span>;
}
