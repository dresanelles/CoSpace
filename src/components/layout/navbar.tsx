"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { buttonClasses } from "@/components/ui/button";
import type { UserDTO } from "@/types/api";

interface NavbarProps {
  /** Si viene, se muestra el menú de usuario; si no, Ingresar / Crear cuenta. */
  user?: UserDTO;
}

export function Navbar({ user }: NavbarProps) {
  const t = useTranslations("common");

  return (
    <header className="flex items-center gap-4 px-5 py-4 md:gap-7 md:px-7">
      <Logo />
      <nav className="hidden items-center gap-6 text-sm sm:flex">
        <Link href="/spaces">{t("spaces")}</Link>
        {user && <Link href="/dashboard">{t("myReservations")}</Link>}
      </nav>
      <div className="flex-1" />
      <LocaleSwitcher />
      <ThemeToggle />
      {user ? (
        <UserMenu user={user} />
      ) : (
        <>
          <Link href="/login" className="text-sm">
            {t("login")}
          </Link>
          <Link href="/register" className={buttonClasses("solid", "sm")}>
            {t("createAccount")}
          </Link>
        </>
      )}
    </header>
  );
}
