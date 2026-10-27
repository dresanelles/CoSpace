"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col gap-7">
      <h1 className="display text-5xl md:text-6xl">
        {t("loginTitle")} <span className="accent text-6xl md:text-7xl">{t("loginAccent")}</span>
      </h1>
      <LoginForm />
      <p className="text-sm text-mute">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
