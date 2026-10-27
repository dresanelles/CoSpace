import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="display text-4xl">
        Crear <span className="accent">cuenta</span>
      </h1>
      <RegisterForm />
      <p className="text-sm text-mute">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
          Ingresa
        </Link>
      </p>
    </div>
  );
}
