import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases condicionales (clsx) y resuelve conflictos de Tailwind (twMerge). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
