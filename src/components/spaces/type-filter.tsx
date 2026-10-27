import Link from "next/link";
import { chipClasses } from "@/components/ui/chip";
import type { SpaceType } from "@/types/api";

const options: { type: SpaceType | undefined; label: string }[] = [
  { type: undefined, label: "Todos" },
  { type: "desk", label: "Escritorios" },
  { type: "meeting_room", label: "Salas" },
  { type: "cabin", label: "Cabinas" },
];

/** Filtros como enlaces: el tipo viaja en la URL (?type=) y el servidor filtra. */
export function TypeFilter({ active }: { active: SpaceType | undefined }) {
  return (
    <nav aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
      {options.map(({ type, label }) => (
        <Link
          key={label}
          href={type ? `/spaces?type=${type}` : "/spaces"}
          aria-current={type === active ? "page" : undefined}
          className={chipClasses(type === active)}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
