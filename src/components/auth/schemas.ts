import { z } from "zod";

// Validación de los formularios (misma forma que recibirá la API).
// El backend la vuelve a validar: esta es solo para dar feedback rápido.
export const loginSchema = z.object({
  email: z.email("Escribe un correo válido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Escribe un correo válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

/** Errores por campo: { email: "mensaje", ... }. Solo el primero de cada campo. */
export type FieldErrors = Partial<Record<string, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    if (errors[field] === undefined) errors[field] = issue.message;
  }
  return errors;
}
