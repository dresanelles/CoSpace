import { Hero } from "@/components/home/hero";
import { TypeStrip, type TypeStat } from "@/components/home/type-strip";
import { getSpaces } from "@/mocks/spaces";
import type { SpaceType } from "@/types/api";

// SSG: sin datos por petición, la página se genera en el build.
const typeLabels: Record<SpaceType, string> = {
  desk: "Escritorios",
  meeting_room: "Salas",
  cabin: "Cabinas",
};

export default async function HomePage() {
  const spaces = await getSpaces();
  const minPrice = Math.min(...spaces.map((space) => space.pricePerHour));

  const stats: TypeStat[] = (Object.keys(typeLabels) as SpaceType[]).map((type) => ({
    type,
    label: typeLabels[type],
    count: spaces.filter((space) => space.type === type).length,
  }));

  return (
    <>
      <Hero minPrice={minPrice} />
      <TypeStrip stats={stats} />
    </>
  );
}
