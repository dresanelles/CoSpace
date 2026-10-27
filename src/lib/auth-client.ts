import { apiFetch } from "@/lib/api-client";
import type { AuthResponseDTO, LoginInput, RegisterInput, UserDTO } from "@/types/api";

export async function registerRequest(input: RegisterInput): Promise<UserDTO> {
  const { user } = await apiFetch<AuthResponseDTO>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return user;
}

export async function loginRequest(input: LoginInput): Promise<UserDTO> {
  const { user } = await apiFetch<AuthResponseDTO>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return user;
}

export async function fetchCurrentUser(): Promise<UserDTO> {
  const { user } = await apiFetch<AuthResponseDTO>("/api/auth/me");
  return user;
}
