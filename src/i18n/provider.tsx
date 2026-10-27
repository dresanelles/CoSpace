"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { getLocaleSnapshot, getServerLocale, subscribe } from "@/i18n/locale-store";
import { messages } from "@/i18n/messages";

/**
 * El HTML estático (Home en SSG) sale en el idioma por defecto. Al hidratar,
 * useSyncExternalStore pasa a leer la cookie y el contenido cambia de idioma
 * sin avisos de hidratación.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, getServerLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="America/Bogota">
      {children}
    </NextIntlClientProvider>
  );
}
