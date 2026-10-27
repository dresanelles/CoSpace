"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormAlert } from "@/components/auth/form-alert";
import { loginSchema } from "@/components/auth/schemas";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useApiErrorMessage } from "@/i18n/use-api-error";
import { toFieldErrors, type FieldErrors } from "@/i18n/validation";
import { loginRequest } from "@/mocks/auth";

export function LoginForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const apiErrorMessage = useApiErrorMessage();
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  // Se guarda el error (no su texto) para traducirlo al renderizar: si cambia el idioma, se actualiza.
  const [failure, setFailure] = useState<{ error: unknown } | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFailure(null);

    const parsed = loginSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setPending(true);
    try {
      const user = await loginRequest(parsed.data);
      toast.success(t("welcomeBack", { name: user.name }));
      router.push("/dashboard");
    } catch (error) {
      setFailure({ error });
      setPending(false);
    }
  }

  const emailError = errors.email && tv(errors.email);
  const passwordError = errors.password && tv(errors.password);

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={failure ? apiErrorMessage(failure.error) : null} />
      <Field label={t("email")} name="email" type="email" autoComplete="email" placeholder={t("emailPlaceholder")} error={emailError} />
      <Field label={t("password")} name="password" type="password" autoComplete="current-password" error={passwordError} />
      <Button type="submit" disabled={pending}>
        {pending ? t("loggingIn") : t("loginSubmit")}
      </Button>
    </form>
  );
}
