import Link from "next/link";
import { Photo } from "@/components/ui/photo";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import type { SpaceDTO, SpaceType } from "@/types/api";

// El color identifica el tipo de espacio (SRS §13).
export const typeColor: Record<SpaceType, string> = {
  desk: "bg-lime",
  meeting_room: "bg-sky",
  cabin: "bg-pink",
};

export const typeLabel: Record<SpaceType, string> = {
  desk: "Escritorio",
  meeting_room: "Sala",
  cabin: "Cabina",
};

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

export function SpaceCard({ space }: { space: SpaceDTO }) {
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
        <span className="absolute right-3 top-3 rotate-3 rounded-md bg-paper px-2.5 py-1 font-mono text-[13px] text-ink">
          {formatPrice(space.pricePerHour)}/h
        </span>
      </div>
      <Tag className={cn("mt-3 text-on-pastel", typeColor[space.type])}>{typeLabel[space.type]}</Tag>
      <h3 className="mb-0.5 mt-2 text-[22px] font-bold tracking-tight">{space.name}</h3>
      <p className="text-sm text-mute">
        {space.capacity} {space.capacity === 1 ? "persona" : "personas"}
        {space.amenities[0] ? ` · ${space.amenities[0]}` : ""}
      </p>
    </Link>
  );
}
