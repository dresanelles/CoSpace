import type { ReactNode } from "react";
import { AuthShowcase } from "@/components/auth/auth-showcase";
import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

// Pantalla dividida: panel de color + formulario. En móvil se apilan.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh md:grid-cols-[1.05fr_1fr]">
      <AuthShowcase />
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6">
          <Logo />
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
