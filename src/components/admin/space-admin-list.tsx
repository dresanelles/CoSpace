"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import { SpaceAdminRow } from "@/components/admin/space-admin-row";
import { buttonClasses } from "@/components/ui/button";
import { useApiErrorMessage } from "@/i18n/use-api-error";
import { deactivateSpaceRequest, fetchAdminSpaces } from "@/lib/admin-client";

export function SpaceAdminList() {
  const t = useTranslations("admin");
  const apiErrorMessage = useApiErrorMessage();
  const { data, error, isLoading, mutate } = useSWR("/api/spaces?includeInactive=true", fetchAdminSpaces);

  async function handleDeactivate(id: string): Promise<void> {
    try {
      await deactivateSpaceRequest(id);
      toast.success(t("deactivatedToast"));
      await mutate();
    } catch (cause) {
      // Aquí llega el 409 de RN-13 con el mensaje que escribió el servidor.
      toast.error(apiErrorMessage(cause));
    }
  }

  return (
    <>
      <div className="mb-6 mt-4 flex items-center justify-between gap-4">
        <p className="font-label text-sm text-mute">
          {data ? t("activeCount", { active: data.filter((space) => space.isActive).length, total: data.length }) : " "}
        </p>
        <Link href="/admin/spaces/new" className={buttonClasses("solid", "md")}>
          <Plus className="size-4" /> {t("newSpace")}
        </Link>
      </div>

      {isLoading && (
        <ul aria-busy="true" aria-label={t("loading")}>
          {[0, 1, 2, 3].map((key) => (
            <li key={key} className="my-4 h-14 animate-pulse rounded-[10px] bg-ink/10" />
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel">
          {t("loadError")}
        </p>
      )}

      {data && (
        <ul className="border-t border-ink/15">
          {data.map((space) => (
            <SpaceAdminRow key={space.id} space={space} onDeactivate={handleDeactivate} />
          ))}
        </ul>
      )}
    </>
  );
}
