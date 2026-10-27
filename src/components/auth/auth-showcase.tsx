"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/cn";

/**
 * Panel de color de las pantallas de acceso: lima para ingresar, rosa para registrarse.
 * En móvil queda como una franja con el titular; las fotos solo aparecen en escritorio.
 */
export function AuthShowcase() {
  const t = useTranslations("auth");
  const isRegister = usePathname() === "/register";

  return (
    <section
      className={cn(
        "relative overflow-hidden px-5 py-8 text-on-pastel md:flex md:min-h-dvh md:flex-col md:justify-between md:p-12",
        isRegister ? "bg-pink" : "bg-lime",
      )}
    >
      <div>
        <Logo />
        <h2 className="display mt-8 md:mt-14 text-[clamp(44px,7vw,92px)]">
          {isRegister ? t("showcaseRegisterTitle") : t("showcaseLoginTitle")}
          <br />
          <span className="accent text-[1.15em] leading-[0.9]">
            {isRegister ? t("showcaseRegisterAccent") : t("showcaseLoginAccent")}
          </span>
        </h2>
        <p className="mt-4 max-w-sm text-lg leading-snug md:mt-6">
          {isRegister ? t("showcaseRegisterText") : t("showcaseLoginText")}
        </p>
      </div>

      {/* Collage de fotos giradas, como en la Home */}
      <div aria-hidden className="relative mt-10 hidden h-[340px] md:block">
        <Photo
          src="/img/people/equipo-3.jpg"
          alt=""
          sizes="(min-width: 768px) 30vw, 0px"
          className="absolute bottom-6 right-4 h-[78%] w-[62%] rotate-[2.5deg] rounded-[10px]"
        />
        <Photo
          src="/img/people/equipo-1.jpg"
          alt=""
          sizes="(min-width: 768px) 24vw, 0px"
          className="absolute bottom-0 left-0 h-[52%] w-[46%] -rotate-3 rounded-[10px]"
        />
        <span className="absolute right-[38%] top-0 z-10 h-5 w-[70px] -rotate-8 bg-white/60" />
      </div>
    </section>
  );
}
