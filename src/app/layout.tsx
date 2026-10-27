import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Caveat,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth"], // eje de ancho: permite el look condensado (wdth 75)
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "CoSpace",
  description: "Reserva escritorios, salas y cabinas de coworking por horas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes añade data-theme antes de hidratar.
    <html
      lang="es"
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrumentSerif.variable} ${instrumentSans.variable} ${caveat.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
