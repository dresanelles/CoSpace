"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col gap-7">
      <h1 className="display text-5xl md:text-6xl">
        {t("registerTitle")} <span className="accent text-6xl md:text-7xl">{t("registerAccent")}</span>
      </h1>
      <RegisterForm />
      <p className="text-sm text-mute">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}
