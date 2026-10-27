"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { spaceSchema, toFieldErrors, type FieldErrors } from "@/components/admin/space-schema";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { ApiError } from "@/mocks/api-error";
import type { CreateSpaceInput, SpaceDTO } from "@/types/api";

const typeOptions = [
  { value: "", label: "Elige un tipo…" },
  { value: "desk", label: "Escritorio" },
  { value: "meeting_room", label: "Sala de reuniones" },
  { value: "cabin", label: "Cabina" },
];

interface SpaceFormProps {
  /** Si viene, el formulario edita ese espacio; si no, crea uno nuevo. */
  space?: SpaceDTO;
  submitLabel: string;
  onSubmit: (input: CreateSpaceInput) => Promise<void>;
}

export function SpaceForm({ space, submitLabel, onSubmit }: SpaceFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const parsed = spaceSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setPending(true);
    try {
      await onSubmit(parsed.data);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Algo salió mal. Inténtalo de nuevo.");
      setPending(false);
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="grid max-w-2xl gap-4 md:grid-cols-2">
      {formError && (
        <p role="alert" className="rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel md:col-span-2">
          {formError}
        </p>
      )}
      <div className="md:col-span-2">
        <Field label="Nombre" name="name" defaultValue={space?.name} error={errors.name} />
      </div>
      <div className="md:col-span-2">
        <TextareaField label="Descripción" name="description" defaultValue={space?.description} error={errors.description} />
      </div>
      <SelectField label="Tipo" name="type" options={typeOptions} defaultValue={space?.type ?? ""} error={errors.type} />
      <Field label="Capacidad (personas)" name="capacity" type="number" min={1} defaultValue={space?.capacity} error={errors.capacity} />
      <Field label="Precio por hora (COP)" name="pricePerHour" type="number" min={1000} step={500} defaultValue={space?.pricePerHour} error={errors.pricePerHour} />
      <Field label="Imagen" name="imageUrl" placeholder="/img/spaces/…  o  https://…" defaultValue={space?.imageUrl} error={errors.imageUrl} />
      <div className="md:col-span-2">
        <Field
          label="Amenidades (separadas por coma)"
          name="amenities"
          placeholder="WiFi 1 GB, Pantalla, Café"
          defaultValue={space?.amenities.join(", ")}
          error={errors.amenities}
        />
      </div>
      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : submitLabel}
        </Button>
        <Link href="/admin" className={buttonClasses("outline", "md")}>
          Volver
        </Link>
      </div>
    </form>
  );
}
