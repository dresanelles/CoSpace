"use client";

import { useTranslations } from "next-intl";
import type { Messages } from "@/i18n/messages";
import es from "@/i18n/messages/es.json";
import { ApiError } from "@/mocks/api-error";

type ErrorCode = keyof Messages["errors"];

const isErrorCode = (code: string): code is ErrorCode => code in es.errors;

/** Traduce un error de la API por su `code`; el texto del servidor no se muestra tal cual. */
export function useApiErrorMessage(): (error: unknown) => string {
  const t = useTranslations("errors");
  const common = useTranslations("common");

  return (error) => {
    if (error instanceof ApiError && isErrorCode(error.body.error.code)) {
      return t(error.body.error.code);
    }
    return common("genericError");
  };
}
