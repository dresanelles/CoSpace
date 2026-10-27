"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { logoutRequest } from "@/lib/auth-client";
import type { UserDTO } from "@/types/api";

/** Menú desplegable del usuario. */
export function UserMenu({ user }: { user: UserDTO }) {
  const t = useTranslations("common");
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);

  async function handleLogout(): Promise<void> {
    await logoutRequest(); // revoca el refresh token y borra las cookies
    await mutate(() => true, undefined, { revalidate: false }); // vacía la caché de datos del usuario
    router.push("/login");
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 font-label text-xs"
      >
        {user.name.toLowerCase()}
        <ChevronDown className="size-3.5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-3 flex w-44 flex-col rounded-xl bg-surface p-1.5 text-sm"
        >
          <Link role="menuitem" href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-ink/10">
            {t("myReservations")}
          </Link>
          {user.role === "admin" && (
            <Link role="menuitem" href="/admin" className="rounded-lg px-3 py-2 hover:bg-ink/10">
              {t("adminPanel")}
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-left hover:bg-ink/10"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
