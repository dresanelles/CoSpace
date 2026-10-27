"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SpaceForm } from "@/components/admin/space-form";
import { createSpace } from "@/mocks/admin";
import type { CreateSpaceInput } from "@/types/api";

export function CreateSpaceView() {
  const router = useRouter();

  async function handleSubmit(input: CreateSpaceInput): Promise<void> {
    const space = await createSpace(input);
    toast.success(`Espacio «${space.name}» creado`);
    router.push("/admin");
  }

  return <SpaceForm submitLabel="Crear espacio" onSubmit={handleSubmit} />;
}
