"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { UserDTO } from "@/types/api";

/** Menú desplegable del usuario. El cierre de sesión real se conecta con la API. */
export function UserMenu({ user }: { user: UserDTO }) {
  const [open, setOpen] = useState(false);

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
            Mis reservas
          </Link>
          {user.role === "admin" && (
            <Link role="menuitem" href="/admin" className="rounded-lg px-3 py-2 hover:bg-ink/10">
              Panel admin
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            className="rounded-lg px-3 py-2 text-left hover:bg-ink/10"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
