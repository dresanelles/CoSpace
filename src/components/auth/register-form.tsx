"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormAlert } from "@/components/auth/form-alert";
import { registerSchema } from "@/components/auth/schemas";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useApiErrorMessage } from "@/i18n/use-api-error";
import { toFieldErrors, type FieldErrors } from "@/i18n/validation";
import { registerRequest } from "@/mocks/auth";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const apiErrorMessage = useApiErrorMessage();
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState<{ error: unknown } | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFailure(null);

    const parsed = registerSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setPending(true);
    try {
      const user = await registerRequest(parsed.data);
      toast.success(t("accountCreated", { name: user.name }));
      router.push("/dashboard");
    } catch (error) {
      setFailure({ error });
      setPending(false);
    }
  }

  const nameError = errors.name && tv(errors.name);
  const emailError = errors.email && tv(errors.email);
  const passwordError = errors.password && tv(errors.password);

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={failure ? apiErrorMessage(failure.error) : null} />
      <Field label={t("name")} name="name" autoComplete="name" error={nameError} />
      <Field label={t("email")} name="email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} error={emailError} />
      <Field label={t("password")} name="password" type="password" autoComplete="new-password" error={passwordError} />
      <Button type="submit" disabled={pending}>
        {pending ? t("registering") : t("registerSubmit")}
      </Button>
    </form>
  );
}
