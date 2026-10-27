"use client";

import { useTranslations } from "next-intl";
import { SpaceAdminList } from "@/components/admin/space-admin-list";

export default function AdminPage() {
  const t = useTranslations("admin");

  return (
    <>
      <h1 className="display text-5xl md:text-7xl">
        {t("title")} <span className="accent text-6xl md:text-8xl">{t("accent")}</span>
      </h1>
      <SpaceAdminList />
    </>
  );
}
