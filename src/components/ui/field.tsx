import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/** Etiqueta + input + mensaje de error, enlazados por id para accesibilidad. */
export function Field({ label, error, id, className, ...props }: FieldProps) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="font-label text-xs font-medium uppercase tracking-wider text-mute"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "rounded-[10px] bg-surface px-3 py-2.5 text-[15px] text-ink placeholder:text-mute",
          error && "ring-2 ring-pink",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="font-label text-xs text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
