import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, id, className, ...props }: TextareaFieldProps) {
  const fieldId = id ?? props.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="font-label text-xs font-medium uppercase tracking-wider text-mute">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn(
          "resize-y rounded-[10px] bg-ink/10 px-3 py-2.5 text-[15px] text-ink placeholder:text-mute",
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
