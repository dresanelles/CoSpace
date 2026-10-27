"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormAlert } from "@/components/auth/form-alert";
import { registerSchema, toFieldErrors, type FieldErrors } from "@/components/auth/schemas";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ApiError, registerRequest } from "@/mocks/auth";

export function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const parsed = registerSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});

    setPending(true);
    try {
      const user = await registerRequest(parsed.data);
      toast.success(`Cuenta creada. Bienvenido, ${user.name}`);
      router.push("/dashboard");
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Algo salió mal. Inténtalo de nuevo.");
      setPending(false);
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={formError} />
      <Field label="Nombre" name="name" autoComplete="name" error={errors.name} />
      <Field label="Correo" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" error={errors.email} />
      <Field label="Contraseña" name="password" type="password" autoComplete="new-password" error={errors.password} />
      <Button type="submit" disabled={pending}>
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
