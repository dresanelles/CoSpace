import type { Locale } from "@/i18n/config";
import en from "@/i18n/messages/en.json";
import es from "@/i18n/messages/es.json";

export type Messages = typeof es;

// Al tipar `en` como Messages, el compilador avisa si falta o sobra una clave en inglés.
const english: Messages = en;

export const messages: Record<Locale, Messages> = { es, en: english };
