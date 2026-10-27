import type { ApiErrorBody } from "@/types/api";

/** Error de la API con el formato del SRS §10, para que la UI lo trate igual que el real. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error.message);
    this.status = status;
    this.body = body;
  }
}
