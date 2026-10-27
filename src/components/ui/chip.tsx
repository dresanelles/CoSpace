import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Chip de filtro. aria-pressed lo hace operable y comprensible con lector de pantalla. */
export function Chip({ active = false, className, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "rounded-full border-[1.5px] border-ink px-4 py-1.5 text-sm transition-colors",
        active ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-ink/10",
        className,
      )}
      {...props}
    />
  );
}
