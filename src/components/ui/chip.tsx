import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Clases del chip, reutilizables en <Link> (filtros que viajan por la URL). */
export function chipClasses(active: boolean, className?: string): string {
  return cn(
    "inline-block rounded-full px-4 py-1.5 text-sm transition-colors",
    active ? "bg-ink text-paper" : "bg-ink/10 text-ink hover:bg-ink/20",
    className,
  );
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Chip de filtro. aria-pressed lo hace operable y comprensible con lector de pantalla. */
export function Chip({ active = false, className, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={chipClasses(active, className)}
      {...props}
    />
  );
}
