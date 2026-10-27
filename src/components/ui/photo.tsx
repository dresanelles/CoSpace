import Image from "next/image";
import { cn } from "@/lib/cn";

interface PhotoProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/** Foto con borde de tinta y esquinas de la paleta. Sin filtros: se ve tal cual. */
export function Photo({ src, alt, sizes, className, priority }: PhotoProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-[1.5px] border-ink bg-mute/20",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
