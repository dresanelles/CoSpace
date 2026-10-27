"use client";

import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/button";

// Ubicación simulada de CoSpace. Se busca por dirección: Google la geolocaliza sin clave de API.
const ADDRESS = "Carrera 53 #90-40, Barranquilla, Atlántico, Colombia";
const query = encodeURIComponent(ADDRESS);

const embedUrl = `https://www.google.com/maps?q=${query}&z=17&output=embed`;
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

export function LocationMap() {
  const t = useTranslations("home.location");

  return (
    <section className="mx-auto grid w-full max-w-[1440px] items-center gap-10 px-5 py-14 md:grid-cols-[1fr_1.5fr] md:gap-14 md:px-7 md:py-20">
      <div>
        <h2 className="display text-5xl md:text-7xl">
          {t("title")}
          <br />
          <span className="accent text-[1.1em] leading-[0.95]">{t("accent")}</span>
        </h2>

        <ul className="mt-8 space-y-3 text-[17px]">
          <li className="flex items-start gap-3">
            <MapPin className="mt-1 size-5 shrink-0" aria-hidden />
            <span>
              <span className="block font-bold">{t("address")}</span>
              <span className="text-mute">{t("city")}</span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <Clock className="size-5 shrink-0" aria-hidden />
            <span>{t("hours")}</span>
          </li>
        </ul>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("solid", "md", "mt-8")}
        >
          {t("directions")} <ArrowUpRight className="size-4" />
        </a>
      </div>

      {/* Marco girado, como las fotos del hero: cinta, nota a mano y pin de la marca */}
      <div className="relative">
        <span
          aria-hidden
          className="absolute -top-2 left-1/3 z-20 h-5 w-[70px] -rotate-6 bg-lime/85"
        />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-sky md:aspect-[16/10] md:rotate-[1.2deg]">
          {/* El filtro tiñe el mapa con la paleta (cálido y saturado); en oscuro se invierte primero. */}
          <iframe
            title={t("mapTitle")}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="absolute inset-0 size-full border-0 [filter:sepia(0.45)_saturate(2.4)_hue-rotate(-28deg)_contrast(1.05)] dark:[filter:invert(1)_hue-rotate(180deg)_sepia(0.4)_saturate(2)_hue-rotate(-28deg)_contrast(1.05)]"
          />
          {/* Pin de CoSpace sobre el marcador de Google (el mapa queda centrado en la dirección) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(100%+34px)]"
          >
            <div className="rotate-3 rounded-lg bg-pink px-3 py-1.5 text-sm font-extrabold text-on-pastel shadow-hard">
              cospace*
            </div>
            <div className="mx-auto h-3 w-3 -translate-y-1.5 rotate-45 bg-pink" />
          </div>
        </div>
        <span
          aria-hidden
          className="absolute -bottom-6 right-6 z-20 -rotate-6 font-hand text-2xl md:-bottom-8 md:right-10 md:text-3xl"
        >
          {t("note")}
        </span>
      </div>
    </section>
  );
}
