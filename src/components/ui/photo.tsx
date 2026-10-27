import Image from "next/image";
import { cn } from "@/lib/cn";

interface PhotoProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/** Foto sin borde ni filtros: se ve tal cual. */
export function Photo({ src, alt, sizes, className, priority }: PhotoProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-mute/20",
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
