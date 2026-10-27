import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

// Placeholder para ver el layout y los componentes; el formulario real llega en feat/auth-pages.
export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4">
      <h1 className="display text-4xl">
        Ingresar <span className="accent">ya</span>
      </h1>
      <Field label="Correo" name="email" type="email" placeholder="tu@correo.com" />
      <Field label="Contraseña" name="password" type="password" />
      <Button type="submit">Ingresar</Button>
    </form>
  );
}
