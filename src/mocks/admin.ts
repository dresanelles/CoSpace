import { ApiError } from "@/mocks/api-error";
import { getSpaces } from "@/mocks/spaces";
import type { CreateSpaceInput, SpaceDTO, UpdateSpaceInput } from "@/types/api";

// Espacios con reservas futuras confirmadas en los mocks de reservas (para simular RN-13).
const WITH_FUTURE_RESERVATIONS: readonly string[] = ["mock-sala-guadua", "mock-mesa-ceiba"];

let store: SpaceDTO[] | null = null;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function getStore(): Promise<SpaceDTO[]> {
  store ??= await getSpaces();
  return store;
}

const notFound = (): ApiError =>
  new ApiError(404, { error: { code: "NOT_FOUND", message: "El espacio no existe" } });

// Funciones de acceso del admin. Con la API real:
// GET/POST /api/spaces, GET/PATCH /api/spaces/[id], POST /api/spaces/[id]/deactivate.

/** Todos los espacios, activos e inactivos (el catálogo público solo muestra los activos). */
export async function getAdminSpaces(): Promise<SpaceDTO[]> {
  await delay(300);
  return [...(await getStore())];
}

export async function getAdminSpace(id: string): Promise<SpaceDTO> {
  await delay(300);
  const space = (await getStore()).find((item) => item.id === id);
  if (!space) throw notFound();
  return space;
}

export async function createSpace(input: CreateSpaceInput): Promise<SpaceDTO> {
  await delay(400);
  const space: SpaceDTO = {
    ...input,
    id: `mock-space-${Date.now()}`,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  store = [...(await getStore()), space];
  return space;
}

export async function updateSpace(id: string, input: UpdateSpaceInput): Promise<SpaceDTO> {
  await delay(400);
  const spaces = await getStore();
  const current = spaces.find((item) => item.id === id);
  if (!current) throw notFound();
  const updated: SpaceDTO = { ...current, ...input };
  store = spaces.map((item) => (item.id === id ? updated : item));
  return updated;
}

/** RN-12: no se elimina, se desactiva. RN-13: no si tiene reservas futuras confirmadas. */
export async function deactivateSpace(id: string): Promise<SpaceDTO> {
  await delay(400);
  const spaces = await getStore();
  const current = spaces.find((item) => item.id === id);
  if (!current) throw notFound();
  if (WITH_FUTURE_RESERVATIONS.includes(id)) {
    throw new ApiError(409, {
      error: {
        code: "SPACE_HAS_FUTURE_RESERVATIONS",
        message: "No se puede desactivar: tiene reservas futuras confirmadas",
      },
    });
  }
  const updated: SpaceDTO = { ...current, isActive: false };
  store = spaces.map((item) => (item.id === id ? updated : item));
  return updated;
}
