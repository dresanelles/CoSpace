"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="flex justify-between px-5 py-4 font-label text-[13px] md:px-7">
      <span>cospace* © 2026</span>
      <span>{t("madeIn")}</span>
    </footer>
  );
}
