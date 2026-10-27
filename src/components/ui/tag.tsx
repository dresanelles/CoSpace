import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ReservationStatus } from "@/types/api";

/** Etiqueta mono en mayúsculas (tipo de espacio, amenidades). */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full bg-ink/10 px-2.5 py-0.5 font-label text-[11px] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<ReservationStatus, string> = {
  confirmed: "bg-lime text-on-pastel",
  cancelled: "bg-ink/10 text-mute line-through",
};

/** Estado de una reserva. El texto lo recibe ya traducido (i18n llega después). */
export function StatusBadge({
  status,
  label,
}: {
  status: ReservationStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "w-max rounded-full px-2.5 py-1 font-label text-[11px] uppercase",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );
}
