export type ErrorStatus = 400 | 401 | 403 | 404 | 409;

export type ErrorDetails = Record<string, unknown>;

export class AppError extends Error {
  readonly status: ErrorStatus;
  readonly code: string;
  readonly details?: ErrorDetails;

  constructor(status: ErrorStatus, code: string, message: string, details?: ErrorDetails) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code: string, message: string, details?: ErrorDetails): AppError =>
  new AppError(400, code, message, details);

export const unauthorized = (message = "Debes iniciar sesión"): AppError =>
  new AppError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "No tienes permiso para hacer esto"): AppError =>
  new AppError(403, "FORBIDDEN", message);

export const notFound = (message = "Recurso no encontrado"): AppError =>
  new AppError(404, "NOT_FOUND", message);

export const conflict = (code: string, message: string, details?: ErrorDetails): AppError =>
  new AppError(409, code, message, details);