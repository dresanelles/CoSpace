import { z } from "zod";

// Validación de los formularios (misma forma que recibirá la API).
// El backend la vuelve a validar: esta es solo para dar feedback rápido.
// Los mensajes son CLAVES de traducción (namespace "validation"), no texto.
export const loginSchema = z.object({
  email: z.email("invalidEmail"),
  password: z.string().min(1, "passwordRequired"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "nameMin"),
  email: z.email("invalidEmail"),
  password: z.string().min(8, "passwordMin"),
});
