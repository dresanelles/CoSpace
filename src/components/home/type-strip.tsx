"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { SpaceType } from "@/types/api";

const types: readonly SpaceType[] = ["desk", "meeting_room", "cabin"];

const typeBg: Record<SpaceType, string> = {
  desk: "bg-lime",
  meeting_room: "bg-sky",
  cabin: "bg-pink",
};

/** Tres bloques de color, uno por tipo de espacio; enlazan al catálogo filtrado. */
export function TypeStrip() {
  const t = useTranslations("home");
  const labels: Record<SpaceType, string> = {
    desk: t("desks"),
    meeting_room: t("rooms"),
    cabin: t("cabins"),
  };

  return (
    <section className="grid md:grid-cols-3">
      {types.map((type) => (
        <Link
          key={type}
          href={`/spaces?type=${type}`}
          className={cn(
            "group flex min-h-[120px] items-end justify-between px-5 py-6 text-on-pastel md:px-7",
            typeBg[type],
          )}
        >
          <h2 className="display text-[44px]">{labels[type]}</h2>
          <span className="flex items-center gap-1 font-label text-sm font-medium">
            {t("browse")}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </section>
  );
}
