"use client";

import { useTranslations } from "next-intl";
import { TypeFilter } from "@/components/spaces/type-filter";
import { SpaceCard } from "@/components/ui/space-card";
import type { SpaceDTO, SpaceType } from "@/types/api";

interface CatalogViewProps {
  spaces: SpaceDTO[];
  active: SpaceType | undefined;
}

export function CatalogView({ spaces, active }: CatalogViewProps) {
  const t = useTranslations("catalog");

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-7">
      <h1 className="display text-5xl md:text-7xl">
        {t("title")} <span className="accent text-6xl md:text-8xl">{t("accent")}</span>
      </h1>
      <div className="my-6">
        <TypeFilter active={active} />
      </div>
      {spaces.length === 0 ? (
        <p className="font-label text-sm text-mute">{t("empty")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </section>
  );
}
