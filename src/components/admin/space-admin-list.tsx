"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import { SpaceAdminRow } from "@/components/admin/space-admin-row";
import { buttonClasses } from "@/components/ui/button";
import { ApiError } from "@/mocks/api-error";
import { deactivateSpace, getAdminSpaces } from "@/mocks/admin";

export function SpaceAdminList() {
  const { data, error, isLoading, mutate } = useSWR("/api/spaces?all=1", getAdminSpaces);

  async function handleDeactivate(id: string): Promise<void> {
    try {
      await deactivateSpace(id);
      toast.success("Espacio desactivado");
      await mutate();
    } catch (cause) {
      // Aquí llega el 409 de RN-13 con el mensaje que escribió el servidor.
      toast.error(cause instanceof ApiError ? cause.message : "No se pudo desactivar el espacio");
    }
  }

  return (
    <>
      <div className="mb-6 mt-4 flex items-center justify-between gap-4">
        <p className="font-label text-sm text-mute">
          {data ? `${data.filter((space) => space.isActive).length} activos de ${data.length}` : " "}
        </p>
        <Link href="/admin/spaces/new" className={buttonClasses("solid", "md")}>
          <Plus className="size-4" /> Nuevo espacio
        </Link>
      </div>

      {isLoading && (
        <ul aria-busy="true" aria-label="Cargando espacios">
          {[0, 1, 2, 3].map((key) => (
            <li key={key} className="my-4 h-14 animate-pulse rounded-[10px] bg-ink/10" />
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel">
          No pudimos cargar los espacios. Recarga la página.
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
