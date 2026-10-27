import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SpaceType } from "@/types/api";

export interface TypeStat {
  type: SpaceType;
  label: string;
  count: number;
}

const typeBg: Record<SpaceType, string> = {
  desk: "bg-lime",
  meeting_room: "bg-sky",
  cabin: "bg-pink",
};

/** Tres bloques de color, uno por tipo de espacio; enlazan al catálogo filtrado. */
export function TypeStrip({ stats }: { stats: TypeStat[] }) {
  return (
    <section className="grid md:grid-cols-3">
      {stats.map(({ type, label, count }) => (
        <Link
          key={type}
          href={`/spaces?type=${type}`}
          className={cn(
            "group flex min-h-[120px] items-end justify-between px-5 py-6 text-on-pastel md:px-7",
            typeBg[type],
          )}
        >
          <h2 className="display text-[44px]">{label}</h2>
          <span className="flex items-center gap-1 font-mono text-xs">
            {count} {count === 1 ? "espacio" : "espacios"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </section>
  );
}
