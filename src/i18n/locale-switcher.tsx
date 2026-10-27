"use client";

import { useLocale, useTranslations } from "next-intl";
import { locales, type Locale } from "@/i18n/config";
import { setLocale } from "@/i18n/locale-store";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({ className }: { className?: string }) {
  const current: Locale = useLocale();
  const t = useTranslations("language");

  return (
    <div role="group" aria-label={t("label")} className={cn("flex rounded-full bg-ink/10 p-0.5 font-label text-xs font-medium", className)}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-pressed={locale === current}
          onClick={() => setLocale(locale)}
          className={cn(
            "rounded-full px-2.5 py-1.5 uppercase transition-colors",
            locale === current ? "bg-ink text-paper" : "text-ink hover:bg-ink/10",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
