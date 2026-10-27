import { z } from "zod";

// Validación de los formularios: mismos límites que el backend (src/lib/validation/auth.ts).
// El backend siempre vuelve a validar; esta es solo para dar feedback rápido.
// Los mensajes son CLAVES de traducción (namespace "validation"), no texto.
const email = z.email("invalidEmail").max(254, "emailMax");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "passwordRequired").max(72, "passwordMax"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(80, "nameMax"),
  email,
  password: z.string().min(8, "passwordMin").max(72, "passwordMax"),
});
