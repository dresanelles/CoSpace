"use client";

import { useTranslations } from "next-intl";
import { ReservationList } from "@/components/reservations/reservation-list";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <section className="px-5 py-8 md:px-7">
      <h1 className="display text-5xl md:text-7xl">
        {t("title")} <span className="accent text-6xl md:text-8xl">{t("accent")}</span>
      </h1>
      <ReservationList />
    </section>
  );
}
