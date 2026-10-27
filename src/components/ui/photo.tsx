import Image from "next/image";
import { cn } from "@/lib/cn";

export type PhotoTint = "lime" | "sky" | "pink";

const tintClass: Record<PhotoTint, string> = {
  lime: "bg-lime",
  sky: "bg-sky",
  pink: "bg-pink",
};

interface PhotoProps {
  src: string;
  alt: string;
  tint: PhotoTint;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/**
 * Foto con el mismo tratamiento en toda la app: escala de grises parcial,
 * el pastel de la paleta multiplicado encima y grano sutil. Así fotos de
 * orígenes distintos se ven como una sola serie.
 */
export function Photo({ src, alt, tint, sizes, className, priority }: PhotoProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border-[1.5px] border-ink",
        tintClass[tint],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="photo-img object-cover mix-blend-multiply"
      />
      <div aria-hidden className="photo-grain pointer-events-none absolute inset-0" />
    </div>
  );
}
