import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 px-5 py-12">
      <div className="absolute right-5 top-5 flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <Logo />
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6">
        {children}
      </div>
    </main>
  );
}
