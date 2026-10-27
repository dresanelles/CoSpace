import { notFound } from "next/navigation";
import { SpaceDetailView } from "@/components/spaces/space-detail-view";
import { AppError } from "@/lib/errors";
import { toSpaceDTO } from "@/lib/mappers";
import { getSpace } from "@/services/spaces.service";
import type { SpaceDTO } from "@/types/api";

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

/** Un espacio inexistente o desactivado (RN-12) es un 404, no un error del servidor. */
async function loadSpace(id: string): Promise<SpaceDTO | null> {
  try {
    return toSpaceDTO(await getSpace(id, false));
  } catch (error) {
    if (error instanceof AppError && error.status === 404) return null;
    throw error;
  }
}

export default async function SpaceDetailPage({ params }: PageProps<"/spaces/[id]">) {
  const { id } = await params; // en Next 16 params es una Promise
  const space = await loadSpace(id);
  if (!space) notFound();

  const now = new Date();

  return (
    <SpaceDetailView
      space={space}
      minDate={bogotaDate(now)}
      maxDate={bogotaDate(new Date(now.getTime() + 30 * DAY_MS))}
      currentHour={bogotaHour(now)}
    />
  );
}
