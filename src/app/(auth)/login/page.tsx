import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="display text-4xl">
        Ingresar <span className="accent">ya</span>
      </h1>
      <LoginForm />
      <p className="text-sm text-mute">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
          Crea una
        </Link>
      </p>
    </div>
  );
}
