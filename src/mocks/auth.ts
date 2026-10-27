import { ApiError } from "@/mocks/api-error";
import type { LoginInput, RegisterInput, UserDTO } from "@/types/api";

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const fakeUser = (name: string, email: string): UserDTO => ({
  id: "mock-user",
  name,
  email,
  role: "user",
  createdAt: new Date().toISOString(),
});

// Funciones de acceso: cuando exista la API real, solo cambia el cuerpo por
// fetch("/api/auth/login") y fetch("/api/auth/register").
// Casos de prueba: contraseña "incorrecta" -> 401; correo "ocupado@example.com" -> 409.

export async function loginRequest(input: LoginInput): Promise<UserDTO> {
  await delay(600);
  if (input.password === "incorrecta") {
    throw new ApiError(401, {
      error: { code: "INVALID_CREDENTIALS", message: "Correo o contraseña incorrectos" },
    });
  }
  return fakeUser("Andrés", input.email);
}

export async function registerRequest(input: RegisterInput): Promise<UserDTO> {
  await delay(600);
  if (input.email === "ocupado@example.com") {
    throw new ApiError(409, {
      error: { code: "EMAIL_TAKEN", message: "Ya existe una cuenta con ese correo" },
    });
  }
  return fakeUser(input.name, input.email);
}
