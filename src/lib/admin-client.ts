import { apiFetch } from "@/lib/api-client";
import type {
  CreateSpaceInput,
  SpaceDTO,
  SpaceResponseDTO,
  SpacesResponseDTO,
  UpdateSpaceInput,
} from "@/types/api";

/** Todos los espacios, activos e inactivos (solo admin). */
export async function fetchAdminSpaces(): Promise<SpaceDTO[]> {
  const { spaces } = await apiFetch<SpacesResponseDTO>("/api/spaces?includeInactive=true");
  return spaces;
}

export async function fetchAdminSpace(id: string): Promise<SpaceDTO> {
  const { space } = await apiFetch<SpaceResponseDTO>(`/api/spaces/${id}`);
  return space;
}

export async function createSpaceRequest(input: CreateSpaceInput): Promise<SpaceDTO> {
  const { space } = await apiFetch<SpaceResponseDTO>("/api/spaces", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return space;
}

export async function updateSpaceRequest(id: string, input: UpdateSpaceInput): Promise<SpaceDTO> {
  const { space } = await apiFetch<SpaceResponseDTO>(`/api/spaces/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return space;
}

/** RN-12: no se elimina, se desactiva. RN-13 la valida el servidor (409). */
export async function deactivateSpaceRequest(id: string): Promise<SpaceDTO> {
  const { space } = await apiFetch<SpaceResponseDTO>(`/api/spaces/${id}/deactivate`, { method: "POST" });
  return space;
}
