"use client";

import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useNow } from "@/components/reservations/use-now";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { formatPrice, typeColor } from "@/components/ui/space-meta";
import { StatusBadge } from "@/components/ui/tag";
import { dateLocales } from "@/i18n/date-locale";
import { cn } from "@/lib/cn";
import type { ReservationDTO } from "@/types/api";

const MIN_CANCEL_NOTICE_MS = 2 * 60 * 60 * 1000; // RN-10 (el servidor la vuelve a validar)

interface ReservationRowProps {
  reservation: ReservationDTO;
  onCancel: (id: string) => Promise<void>;
}

export function ReservationRow({ reservation, onCancel }: ReservationRowProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const now = useNow();
  const [confirming, setConfirming] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  const start = new Date(reservation.startsAt);
  const end = new Date(reservation.endsAt);
  const cancelled = reservation.status === "cancelled";
  const canCancel = !cancelled && start.getTime() - now >= MIN_CANCEL_NOTICE_MS;

  async function confirmCancel(): Promise<void> {
    setPending(true);
    await onCancel(reservation.id);
    setPending(false);
    setConfirming(false);
  }

  return (
    <li className="grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-3 border-b border-ink/15 py-4 md:grid-cols-[56px_1.4fr_1fr_110px_150px] md:gap-4">
      <Photo
        src={reservation.space.imageUrl}
        alt=""
        sizes="56px"
        className={cn("size-14 rounded-[10px]", typeColor[reservation.space.type], cancelled && "opacity-50")}
      />
      <div className={cn(cancelled && "text-mute")}>
        <p className="font-bold">{reservation.space.name}</p>
        <p className="mt-0.5 font-label text-sm text-mute">
          <span className="capitalize">{format(start, "EEE d MMM", { locale: dateLocales[locale] })}</span>
          {" · "}
          {format(start, "HH:mm")} – {format(end, "HH:mm")}
        </p>
      </div>
      <p className="col-start-2 font-label text-[15px] font-medium md:col-start-auto">
        {formatPrice(reservation.totalPrice)}
      </p>
      <StatusBadge status={reservation.status} label={cancelled ? t("cancelled") : t("confirmed")} />
      <div className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
        {confirming ? (
          <>
            <Button size="sm" disabled={pending} onClick={confirmCancel}>
              {pending ? t("cancelling") : t("confirmCancel")}
            </Button>
            <Button size="sm" variant="outline" disabled={pending} onClick={() => setConfirming(false)}>
              {t("no")}
            </Button>
          </>
        ) : (
          !cancelled && (
            <Button
              size="sm"
              variant="outline"
              disabled={!canCancel}
              title={canCancel ? undefined : t("tooLate")}
              onClick={() => setConfirming(true)}
            >
              {t("cancel")}
            </Button>
          )
        )}
      </div>
    </li>
  );
}
