import { TypeFilter } from "@/components/spaces/type-filter";
import { SpaceCard } from "@/components/ui/space-card";
import { getSpaces } from "@/mocks/spaces";
import type { SpaceType } from "@/types/api";

// SSR: se renderiza en cada petición, así el filtro y los datos siempre están al día.
export const dynamic = "force-dynamic";

const validTypes: readonly SpaceType[] = ["desk", "meeting_room", "cabin"];

/** La URL es entrada del usuario: solo aceptamos valores conocidos. */
function parseType(value: string | string[] | undefined): SpaceType | undefined {
  return validTypes.find((type) => type === value);
}

export default async function SpacesPage({ searchParams }: PageProps<"/spaces">) {
  // En Next 16 searchParams es una Promise.
  const type = parseType((await searchParams).type);
  const spaces = await getSpaces(type);

  return (
    <section className="px-5 py-8 md:px-7">
      <h1 className="display text-5xl md:text-7xl">
        Espacios <span className="accent text-6xl md:text-8xl">disponibles</span>
      </h1>
      <div className="my-6">
        <TypeFilter active={type} />
      </div>
      {spaces.length === 0 ? (
        <p className="font-mono text-sm text-mute">No hay espacios de este tipo por ahora.</p>
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
