import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

/** Select nativo con el mismo aspecto que Field: accesible y operable con teclado sin librerías. */
export function SelectField({ label, options, error, id, className, ...props }: SelectFieldProps) {
  const fieldId = id ?? props.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="font-label text-xs font-medium uppercase tracking-wider text-mute">
        {label}
      </label>
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "rounded-[10px] bg-ink/10 px-3 py-2.5 text-[15px] text-ink",
          error && "ring-2 ring-pink",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" className="font-label text-xs text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
