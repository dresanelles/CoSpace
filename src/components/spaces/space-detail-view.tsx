"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BookingWidget } from "@/components/spaces/booking-widget";
import { Photo } from "@/components/ui/photo";
import { Tag } from "@/components/ui/tag";
import type { SpaceDTO } from "@/types/api";

interface SpaceDetailViewProps {
  space: SpaceDTO;
  minDate: string;
  maxDate: string;
  currentHour: number;
}

export function SpaceDetailView({ space, minDate, maxDate, currentHour }: SpaceDetailViewProps) {
  const t = useTranslations();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-7">
      <Link href="/spaces" className="mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft className="size-4" /> {t("common.spaces")}
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Photo
            src={space.imageUrl}
            alt={space.name}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="h-[300px] rounded-2xl md:h-[400px]"
          />
          <h1 className="display mb-3 mt-6 text-5xl md:text-7xl">{space.name}</h1>
          <p className="max-w-[520px] leading-relaxed">{space.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>{t("common.people", { count: space.capacity })}</Tag>
            {space.amenities.map((amenity) => (
              <Tag key={amenity}>{amenity}</Tag>
            ))}
          </div>
        </div>
        <BookingWidget space={space} minDate={minDate} maxDate={maxDate} currentHour={currentHour} />
      </div>
    </div>
  );
}
