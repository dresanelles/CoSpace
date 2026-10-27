import { Photo } from "@/components/ui/photo";
import { SpaceCard } from "@/components/ui/space-card";
import { getSpaces } from "@/mocks/spaces";

// Placeholder de la base: la Home real llega en feat/public-pages.
export default async function HomePage() {
  const spaces = await getSpaces();

  return (
    <section className="px-5 py-8 md:px-7">
      <h1 className="display text-6xl md:text-8xl">
        Tu escritorio, <span className="accent">tu hora.</span>
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Photo src="/img/people/equipo-1.jpg" alt="Equipo trabajando en una mesa compartida" sizes="25vw" className="aspect-[4/3] rounded-xl" />
        <Photo src="/img/people/equipo-2.jpg" alt="Personas trabajando en escritorios de coworking" sizes="25vw" className="aspect-[4/3] rounded-xl" />
        <Photo src="/img/people/equipo-3.jpg" alt="Colegas revisando un proyecto en pantalla" sizes="25vw" className="aspect-[4/3] rounded-xl" />
        <Photo src="/img/people/equipo-4.jpg" alt="Mujer trabajando con su laptop" sizes="25vw" className="aspect-[4/3] rounded-xl" />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </section>
  );
}
