import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Caveat,
  Familjen_Grotesk,
  Instrument_Serif,
} from "next/font/google";
import { Toaster } from "sonner";
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

const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
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
      className={`${bricolage.variable} ${instrumentSerif.variable} ${familjen.variable} ${caveat.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
