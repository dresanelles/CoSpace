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
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </section>
  );
}
