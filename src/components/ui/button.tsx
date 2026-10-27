import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline";
type Size = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper",
  outline: "bg-ink/10 text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-[13px]",
  md: "px-5 py-3 text-[15px]",
};

/** Clases del botón, reutilizables en <Link> para que un enlace parezca botón. */
export function buttonClasses(
  variant: Variant = "solid",
  size: Size = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
