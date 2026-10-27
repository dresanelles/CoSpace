import { LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

// Layout propio de panel: barra lateral en escritorio, arriba en móvil.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex items-center gap-5 px-5 py-4 md:w-56 md:flex-col md:items-start md:py-6">
        <Logo />
        <span className="rounded-full bg-pink px-2.5 py-0.5 font-label text-[11px] uppercase text-on-pastel">
          admin
        </span>
        <nav className="flex gap-4 text-sm md:mt-4 md:flex-col">
          <Link href="/admin" className="flex items-center gap-2">
            <LayoutDashboard className="size-4" /> Espacios
          </Link>
          <Link href="/admin/spaces/new" className="flex items-center gap-2">
            <Plus className="size-4" /> Nuevo espacio
          </Link>
        </nav>
        <ThemeToggle className="ml-auto md:ml-0 md:mt-auto" />
      </aside>
      <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
    </div>
  );
}
