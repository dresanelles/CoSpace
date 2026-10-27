"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { formatPrice, typeColor } from "@/components/ui/space-meta";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import type { SpaceDTO } from "@/types/api";

interface SpaceAdminRowProps {
  space: SpaceDTO;
  onDeactivate: (id: string) => Promise<void>;
}

export function SpaceAdminRow({ space, onDeactivate }: SpaceAdminRowProps) {
  const t = useTranslations();
  const [confirming, setConfirming] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  async function confirmDeactivate(): Promise<void> {
    setPending(true);
    await onDeactivate(space.id);
    setPending(false);
    setConfirming(false);
  }

  return (
    <li className="grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-3 border-b border-ink/15 py-4 md:grid-cols-[56px_1.6fr_1fr_110px_auto] md:gap-4">
      <Photo
        src={space.imageUrl}
        alt=""
        sizes="56px"
        className={cn("size-14 rounded-[10px]", typeColor[space.type], !space.isActive && "opacity-50")}
      />
      <div className={cn(!space.isActive && "text-mute")}>
        <p className="font-bold">{space.name}</p>
        <p className="mt-0.5 font-label text-sm text-mute">
          {t("common.people", { count: space.capacity })} · {t("common.perHour", { price: formatPrice(space.pricePerHour) })}
        </p>
      </div>
      <div className="col-start-2 md:col-start-auto">
        <Tag className={cn(typeColor[space.type], "text-on-pastel")}>{t(`spaceType.${space.type}`)}</Tag>
      </div>
      <span
        className={cn(
          "w-max rounded-full px-2.5 py-1 font-label text-xs font-medium uppercase tracking-wide",
          space.isActive ? "bg-lime text-on-pastel" : "bg-ink/10 text-mute line-through",
        )}
      >
        {space.isActive ? t("admin.active") : t("admin.inactive")}
      </span>
      <div className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
        {confirming ? (
          <>
            <Button size="sm" disabled={pending} onClick={confirmDeactivate}>
              {pending ? t("admin.deactivating") : t("admin.confirmDeactivate")}
            </Button>
            <Button size="sm" variant="outline" disabled={pending} onClick={() => setConfirming(false)}>
              {t("admin.no")}
            </Button>
          </>
        ) : (
          <>
            <Link href={`/admin/spaces/${space.id}/edit`} className={buttonClasses("outline", "sm")}>
              {t("admin.edit")}
            </Link>
            {space.isActive && (
              <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
                {t("admin.deactivate")}
              </Button>
            )}
          </>
        )}
      </div>
    </li>
  );
}
