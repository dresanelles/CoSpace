import { ApiError } from "@/lib/api-error";
import type { ApiErrorBody } from "@/types/api";

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== "object" || value === null || !("error" in value)) return false;
  const { error } = value;
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    "message" in error &&
    typeof error.message === "string"
  );
}

const networkError = (): ApiError =>
  new ApiError(0, { error: { code: "NETWORK_ERROR", message: "No se pudo conectar con el servidor" } });

/**
 * fetch al backend propio. Las cookies httpOnly viajan solas (mismo origen).
 * Si la respuesta no es 2xx lanza ApiError con el formato del SRS §10.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw networkError();
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw isApiErrorBody(body)
      ? new ApiError(response.status, body)
      : new ApiError(response.status, {
          error: { code: "INTERNAL_ERROR", message: "Respuesta inesperada del servidor" },
        });
  }
  // El cuerpo viene de nuestra propia API (tipada en src/types/api.ts).
  return body as T;
}
