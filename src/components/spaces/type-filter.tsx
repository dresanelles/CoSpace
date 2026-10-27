"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { chipClasses } from "@/components/ui/chip";
import type { SpaceType } from "@/types/api";

const options: readonly (SpaceType | undefined)[] = [undefined, "desk", "meeting_room", "cabin"];

/** Filtros como enlaces: el tipo viaja en la URL (?type=) y el servidor filtra. */
export function TypeFilter({ active }: { active: SpaceType | undefined }) {
  const t = useTranslations("catalog");

  return (
    <nav aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
      {options.map((type) => (
        <Link
          key={type ?? "all"}
          href={type ? `/spaces?type=${type}` : "/spaces"}
          aria-current={type === active ? "page" : undefined}
          className={chipClasses(type === active)}
        >
          {t(type ?? "all")}
        </Link>
      ))}
    </nav>
  );
}
