import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

// Almacén externo del idioma: la fuente de verdad es la cookie.
// useSyncExternalStore lo lee sin errores de hidratación (ver provider.tsx).

const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Idioma guardado en la cookie; si no hay (o es inválido), el idioma por defecto. */
export function getLocaleSnapshot(): Locale {
  const entry = document.cookie.split("; ").find((item) => item.startsWith(`${LOCALE_COOKIE}=`));
  const value = entry?.split("=")[1];
  return isLocale(value) ? value : defaultLocale;
}

/** En el servidor no hay cookie visible para una página estática: siempre el idioma por defecto. */
export function getServerLocale(): Locale {
  return defaultLocale;
}

export function setLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  listeners.forEach((notify) => notify());
}
