import type { z } from "zod";
import type { Messages } from "@/i18n/messages";
import es from "@/i18n/messages/es.json";

export type ValidationKey = keyof Messages["validation"];

/** Los esquemas zod devuelven claves de traducción; esto valida que lo sean. */
export function toValidationKey(message: string): ValidationKey {
  return message in es.validation ? (message as ValidationKey) : "generic";
}

/** Errores por campo: { email: "invalidEmail", ... }. Solo el primero de cada campo. */
export type FieldErrors = Partial<Record<string, ValidationKey>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    if (errors[field] === undefined) errors[field] = toValidationKey(issue.message);
  }
  return errors;
}
