import type { Locale } from "@/i18n/config";
import type es from "@/i18n/messages/es.json";

// Con esto, useTranslations("ns") y t("clave") se comprueban en compilación.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof es;
  }
}
