import { CatalogView } from "@/components/spaces/catalog-view";
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

  return <CatalogView spaces={spaces} active={type} />;
}
