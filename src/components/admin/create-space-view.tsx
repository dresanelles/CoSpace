"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SpaceForm } from "@/components/admin/space-form";
import { createSpace } from "@/mocks/admin";
import type { CreateSpaceInput } from "@/types/api";

export function CreateSpaceView() {
  const t = useTranslations("admin");
  const router = useRouter();

  async function handleSubmit(input: CreateSpaceInput): Promise<void> {
    const space = await createSpace(input);
    toast.success(t("createdToast", { name: space.name }));
    router.push("/admin");
  }

  return (
    <>
      <h1 className="display mb-8 text-5xl md:text-6xl">
        {t("newTitle")} <span className="accent text-6xl md:text-7xl">{t("newAccent")}</span>
      </h1>
      <SpaceForm onSubmit={handleSubmit} />
    </>
  );
}
