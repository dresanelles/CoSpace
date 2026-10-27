import { enUS, es } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";
import type { Locale } from "@/i18n/config";

/** Idioma de date-fns para formatear fechas ("mié 28 oct" / "Wed 28 Oct"). */
export const dateLocales: Record<Locale, DateFnsLocale> = { es, en: enUS };
