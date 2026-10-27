"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const subscribe = (): (() => void) => () => {};

/**
 * El servidor no sabe qué tema tiene el usuario, así que el icono real solo
 * se pinta en el cliente. useSyncExternalStore devuelve `false` en el servidor
 * (y en la hidratación) y `true` ya montado: sin errores de hidratación.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();
  // Antes de montar, siempre "claro": coincide con lo que renderizó el servidor.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-ink/10 transition-transform hover:-rotate-12",
        className,
      )}
    >
      {mounted ? (
        isDark ? <Sun className="size-4" /> : <Moon className="size-4" />
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
