import type { SpaceType } from "@/types/api";

// El color identifica el tipo de espacio (SRS §13).
export const typeColor: Record<SpaceType, string> = {
  desk: "bg-lime",
  meeting_room: "bg-sky",
  cabin: "bg-pink",
};

/** Precios en pesos colombianos, con el separador de miles de Colombia en ambos idiomas. */
export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}
