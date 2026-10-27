"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { formatPrice, typeColor } from "@/components/ui/space-meta";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import type { SpaceDTO } from "@/types/api";

export function SpaceCard({ space }: { space: SpaceDTO }) {
  const t = useTranslations();

  return (
    <Link href={`/spaces/${space.id}`} className="group block">
      <div className="relative">
        <Photo
          src={space.imageUrl}
          alt={space.name}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="h-52 rounded-xl [&_img]:transition-transform [&_img]:duration-300 group-hover:[&_img]:scale-105"
        />
        {/* Sticker de precio rotado ~3° */}
        <span className="absolute right-3 top-3 rotate-3 rounded-md bg-paper px-2.5 py-1 font-label text-sm font-medium text-ink">
          {t("common.perHour", { price: formatPrice(space.pricePerHour) })}
        </span>
      </div>
      <Tag className={cn("mt-3 text-on-pastel", typeColor[space.type])}>{t(`spaceType.${space.type}`)}</Tag>
      <h3 className="mb-0.5 mt-2 text-[22px] font-bold tracking-tight">{space.name}</h3>
      <p className="text-sm text-mute">
        {t("common.people", { count: space.capacity })}
        {space.amenities[0] ? ` · ${space.amenities[0]}` : ""}
      </p>
    </Link>
  );
}
