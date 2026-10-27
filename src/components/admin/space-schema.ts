import { z } from "zod";

export const spaceSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().trim().min(10, "Describe el espacio en al menos 10 caracteres"),
  type: z.enum(["desk", "meeting_room", "cabin"], { error: "Elige un tipo de espacio" }),
  capacity: z.coerce.number().int("Debe ser un número entero").min(1, "Mínimo 1 persona").max(100, "Máximo 100"),
  pricePerHour: z.coerce.number().int("Debe ser un número entero").min(1000, "Mínimo $1.000 por hora"),
  imageUrl: z
    .string()
    .trim()
    .refine((value) => value.startsWith("/") || value.startsWith("https://"), "Usa una ruta (/img/...) o una URL https"),
  // El formulario envía texto separado por comas; la API recibe un arreglo.
  amenities: z
    .string()
    .transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean)),
});

export type FieldErrors = Partial<Record<string, string>>;

/** Primer mensaje de error por campo: { name: "mensaje", ... }. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    if (errors[field] === undefined) errors[field] = issue.message;
  }
  return errors;
}
