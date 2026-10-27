import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/spaces/booking-widget";
import { Photo } from "@/components/ui/photo";
import { Tag } from "@/components/ui/tag";
import { getSpaceById } from "@/mocks/spaces";

// SSR: la fecha mínima y la hora actual dependen del momento de la petición.
export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD en la zona de negocio (America/Bogota), no la del servidor. */
function bogotaDate(date: Date): string {
  return date.toLocaleDateString("sv-SE", { timeZone: "America/Bogota" });
}

function bogotaHour(date: Date): number {
  return Number(
    date.toLocaleString("en-GB", { timeZone: "America/Bogota", hour: "2-digit", hour12: false }),
  );
}

export default async function SpaceDetailPage({ params }: PageProps<"/spaces/[id]">) {
  const { id } = await params; // en Next 16 params es una Promise
  const space = await getSpaceById(id);
  if (!space) notFound();

  const now = new Date();

  return (
    <div className="px-5 py-8 md:px-7">
      <Link href="/spaces" className="mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft className="size-4" /> Espacios
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
            <Tag>
              {space.capacity} {space.capacity === 1 ? "persona" : "personas"}
            </Tag>
            {space.amenities.map((amenity) => (
              <Tag key={amenity}>{amenity}</Tag>
            ))}
          </div>
        </div>
        <BookingWidget
          space={space}
          minDate={bogotaDate(now)}
          maxDate={bogotaDate(new Date(now.getTime() + 30 * DAY_MS))}
          currentHour={bogotaHour(now)}
        />
      </div>
    </div>
  );
}
