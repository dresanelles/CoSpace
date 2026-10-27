import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ReservationStatus } from "@/types/api";

/** Etiqueta mono en mayúsculas (tipo de espacio, amenidades). */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-[1.5px] border-ink px-2.5 py-0.5 font-mono text-[11px] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<ReservationStatus, string> = {
  confirmed: "bg-lime text-on-pastel border-ink",
  cancelled: "border-mute text-mute line-through",
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
        "w-max rounded-full border-[1.5px] px-2.5 py-1 font-mono text-[11px] uppercase",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );
}
