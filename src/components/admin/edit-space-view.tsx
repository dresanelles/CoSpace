"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { SpaceForm } from "@/components/admin/space-form";
import { getAdminSpace, updateSpace } from "@/mocks/admin";
import type { CreateSpaceInput } from "@/types/api";

export function EditSpaceView({ id }: { id: string }) {
  const router = useRouter();
  const { data: space, error, isLoading } = useSWR(["/api/spaces", id], () => getAdminSpace(id));

  async function handleSubmit(input: CreateSpaceInput): Promise<void> {
    const updated = await updateSpace(id, input);
    toast.success(`Espacio «${updated.name}» actualizado`);
    router.push("/admin");
  }

  if (isLoading) return <div aria-busy="true" className="h-64 max-w-2xl animate-pulse rounded-2xl bg-ink/10" />;

  if (error || !space) {
    return (
      <p role="alert" className="max-w-2xl rounded-lg bg-pink px-3 py-2 text-sm text-on-pastel">
        No encontramos este espacio.
      </p>
    );
  }

  return <SpaceForm space={space} submitLabel="Guardar cambios" onSubmit={handleSubmit} />;
}
