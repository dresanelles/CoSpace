"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { SpaceForm } from "@/components/admin/space-form";
import { getAdminSpace, updateSpace } from "@/mocks/admin";
import type { CreateSpaceInput } from "@/types/api";

export function EditSpaceView({ id }: { id: string }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { data: space, error, isLoading } = useSWR(["/api/spaces", id], () => getAdminSpace(id));

  async function handleSubmit(input: CreateSpaceInput): Promise<void> {
    const updated = await updateSpace(id, input);
    toast.success(t("updatedToast", { name: updated.name }));
    router.push("/admin");
  }

  return (
    <>
      <h1 className="display mb-8 text-5xl md:text-6xl">
        {t("editTitle")} <span className="accent text-6xl md:text-7xl">{t("editAccent")}</span>
      </h1>
      {isLoading ? (
        <div aria-busy="true" className="h-64 max-w-2xl animate-pulse rounded-2xl bg-ink/10" />
      ) : error || !space ? (
        <p role="alert" className="max-w-2xl rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel">
          {t("notFound")}
        </p>
      ) : (
        <SpaceForm space={space} onSubmit={handleSubmit} />
      )}
    </>
  );
}
