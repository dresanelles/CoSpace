import type { SpaceDTO, UserDTO } from "@/types/api";

// Datos de ejemplo que cumplen el contrato de src/types/api.ts.
// Cuando exista la API real, solo cambia el cuerpo de estas funciones por un fetch.

const spaces: SpaceDTO[] = [
  {
    id: "mock-mesa-ceiba",
    name: "Mesa Ceiba",
    description: "Escritorio junto a la ventana con luz natural.",
    type: "desk",
    capacity: 1,
    pricePerHour: 8000,
    imageUrl: "/img/spaces/escritorio.jpg",
    amenities: ["Ventana", "WiFi 1 GB"],
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "mock-sala-guadua",
    name: "Sala Guadua",
    description: 'Sala luminosa para equipos pequeños. Pantalla de 55", tablero y cafetera.',
    type: "meeting_room",
    capacity: 8,
    pricePerHour: 45000,
    imageUrl: "/img/spaces/sala-grande.jpg",
    amenities: ["Pantalla", "WiFi 1 GB", "Café"],
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "mock-cabina-silencio",
    name: "Cabina Silencio",
    description: "Cabina insonorizada para llamadas y trabajo profundo.",
    type: "cabin",
    capacity: 1,
    pricePerHour: 18000,
    imageUrl: "/img/spaces/cabina.jpg",
    amenities: ["Insonorizada", "WiFi 1 GB"],
    isActive: true,
    createdAt: "2026-10-01T12:00:00.000Z",
  },
];

export async function getSpaces(): Promise<SpaceDTO[]> {
  return spaces;
}

export async function getSpaceById(id: string): Promise<SpaceDTO | null> {
  return spaces.find((space) => space.id === id) ?? null;
}

export const mockUser: UserDTO = {
  id: "mock-user",
  email: "andres@example.com",
  name: "Andrés",
  role: "admin",
  createdAt: "2026-10-01T12:00:00.000Z",
};
