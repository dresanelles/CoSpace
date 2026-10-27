import { apiFetch } from "@/lib/api-client";
import { ApiError } from "@/lib/api-error";
import type { AuthResponseDTO, LoginInput, RegisterInput, UserDTO } from "@/types/api";

export async function registerRequest(input: RegisterInput): Promise<UserDTO> {
  const { user } = await apiFetch<AuthResponseDTO>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return user;
}

export async function loginRequest(input: LoginInput): Promise<UserDTO> {
  try {
    const { user } = await apiFetch<AuthResponseDTO>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return user;
  } catch (error) {
    // El backend responde 401 con code UNAUTHORIZED también para credenciales malas;
    // en el login lo distinguimos para mostrar el mensaje correcto.
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError(401, {
        error: { code: "INVALID_CREDENTIALS", message: error.message },
      });
    }
    throw error;
  }
}

export async function fetchCurrentUser(): Promise<UserDTO> {
  const { user } = await apiFetch<AuthResponseDTO>("/api/auth/me");
  return user;
}
