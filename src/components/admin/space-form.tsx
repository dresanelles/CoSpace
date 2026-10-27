"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { spaceSchema } from "@/components/admin/space-schema";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { useApiErrorMessage } from "@/i18n/use-api-error";
import { toFieldErrors, type FieldErrors } from "@/i18n/validation";
import type { CreateSpaceInput, SpaceDTO } from "@/types/api";

interface SpaceFormProps {
  /** Si viene, el formulario edita ese espacio; si no, crea uno nuevo. */
  space?: SpaceDTO;
  onSubmit: (input: CreateSpaceInput) => Promise<void>;
}

export function SpaceForm({ space, onSubmit }: SpaceFormProps) {
  const t = useTranslations("admin.form");
  const tv = useTranslations("validation");
  const tc = useTranslations("common");
  const apiErrorMessage = useApiErrorMessage();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState<{ error: unknown } | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  const typeOptions = [
    { value: "", label: t("chooseType") },
    { value: "desk", label: t("desk") },
    { value: "meeting_room", label: t("meeting_room") },
    { value: "cabin", label: t("cabin") },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFailure(null);

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
      setFailure({ error });
      setPending(false);
    }
  }

  const error = (field: string): string | undefined => {
    const key = errors[field];
    return key ? tv(key) : undefined;
  };

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="grid max-w-2xl gap-4 md:grid-cols-2">
      {failure && (
        <p role="alert" className="rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel md:col-span-2">
          {apiErrorMessage(failure.error)}
        </p>
      )}
      <div className="md:col-span-2">
        <Field label={t("name")} name="name" defaultValue={space?.name} error={error("name")} />
      </div>
      <div className="md:col-span-2">
        <TextareaField label={t("description")} name="description" defaultValue={space?.description} error={error("description")} />
      </div>
      <SelectField label={t("type")} name="type" options={typeOptions} defaultValue={space?.type ?? ""} error={error("type")} />
      <Field label={t("capacity")} name="capacity" type="number" min={1} defaultValue={space?.capacity} error={error("capacity")} />
      <Field label={t("price")} name="pricePerHour" type="number" min={1000} step={500} defaultValue={space?.pricePerHour} error={error("pricePerHour")} />
      <Field label={t("image")} name="imageUrl" placeholder={t("imagePlaceholder")} defaultValue={space?.imageUrl} error={error("imageUrl")} />
      <div className="md:col-span-2">
        <Field
          label={t("amenities")}
          name="amenities"
          placeholder={t("amenitiesPlaceholder")}
          defaultValue={space?.amenities.join(", ")}
          error={error("amenities")}
        />
      </div>
      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : space ? t("save") : t("create")}
        </Button>
        <Link href="/admin" className={buttonClasses("outline", "md")}>
          {tc("back")}
        </Link>
      </div>
    </form>
  );
}
