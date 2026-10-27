"use client";

import { LayoutDashboard, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/i18n/locale-switcher";

// Barra lateral en escritorio, arriba en móvil.
export function AdminSidebar() {
  const t = useTranslations("admin");

  return (
    <aside className="flex items-center gap-5 px-5 py-4 md:w-56 md:flex-col md:items-start md:py-6">
      <Logo />
      <span className="rounded-full bg-pink px-2.5 py-1 font-label text-xs font-medium uppercase tracking-wide text-on-pastel">
        {t("badge")}
      </span>
      <nav className="flex gap-4 text-sm md:mt-4 md:flex-col">
        <Link href="/admin" className="flex items-center gap-2">
          <LayoutDashboard className="size-4" /> {t("navSpaces")}
        </Link>
        <Link href="/admin/spaces/new" className="flex items-center gap-2">
          <Plus className="size-4" /> {t("newSpace")}
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-2 md:ml-0 md:mt-auto">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </aside>
  );
}
