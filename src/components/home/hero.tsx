import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

export function Hero({ minPrice }: { minPrice: number }) {
  return (
    <section className="grid gap-8 px-5 pb-10 pt-10 md:grid-cols-[1.25fr_1fr] md:px-7 md:pt-12">
      <div className="relative">
        <h1 className="display text-[clamp(52px,9.2vw,118px)]">
          Tu escritorio,
          <br />
          tu sala,
          <br />
          <span className="inline-block -rotate-[1.5deg] bg-lime px-[0.12em] text-on-pastel">
            tu hora.
          </span>
        </h1>
        <p className="my-6 max-w-[420px] text-lg leading-snug">
          Reserva escritorios, salas de reuniones y cabinas por horas. Sin
          contratos, sin vueltas.
        </p>
        <Link href="/spaces" className={buttonClasses("solid", "md")}>
          Explorar espacios <ArrowRight className="size-4" />
        </Link>
        {/* Nota a mano: uso mínimo de Caveat */}
        <span className="mt-6 block -rotate-6 font-hand text-2xl md:absolute md:bottom-2 md:left-72 md:mt-0">
          desde ${minPrice.toLocaleString("es-CO")}/h
        </span>
      </div>

      {/* Collage de fotos giradas */}
      <div className="relative min-h-[320px] md:min-h-[380px]">
        <Photo
          src="/img/people/equipo-3.jpg"
          alt="Colegas revisando un proyecto en pantalla"
          sizes="(min-width: 768px) 30vw, 70vw"
          priority
          className="absolute right-0 top-0 h-[62%] w-[62%] rotate-[2.5deg] rounded-[10px]"
        />
        <Photo
          src="/img/people/equipo-1.jpg"
          alt="Equipo trabajando en una mesa compartida"
          sizes="(min-width: 768px) 24vw, 55vw"
          className="absolute bottom-0 left-0 h-[48%] w-[48%] -rotate-3 rounded-[10px]"
        />
        <Photo
          src="/img/people/equipo-4.jpg"
          alt="Mujer trabajando con su laptop"
          sizes="(min-width: 768px) 18vw, 40vw"
          className="absolute bottom-[6%] right-[6%] h-[34%] w-[36%] rotate-4 rounded-[10px]"
        />
        <span
          aria-hidden
          className="absolute left-[38%] top-[-8px] z-10 h-5 w-[70px] -rotate-8 bg-lime/85"
        />
      </div>
    </section>
  );
}
