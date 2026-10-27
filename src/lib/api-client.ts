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

// Rutas de auth donde un 401 es la respuesta final (credenciales malas, sin sesión...): no se renueva.
const NO_REFRESH: readonly string[] = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
];

let refreshing: Promise<boolean> | null = null;

/** Pide un access token nuevo con el refresh token (RF-03). Varias peticiones comparten una sola renovación. */
function refreshSession(): Promise<boolean> {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function send(path: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw networkError();
  }
}

/**
 * fetch al backend propio. Las cookies httpOnly viajan solas (mismo origen).
 * Si el access token venció (401) renueva la sesión y reintenta una vez.
 * Si la respuesta no es 2xx lanza ApiError con el formato del SRS §10.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response = await send(path, init);

  if (response.status === 401 && !NO_REFRESH.includes(path) && (await refreshSession())) {
    response = await send(path, init);
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
