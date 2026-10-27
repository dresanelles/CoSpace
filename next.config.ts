import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Oculta el botón "N" de Next.js en desarrollo; los errores de compilación se siguen mostrando.
  devIndicators: false,
  // Fotos de los espacios (seed) alojadas en Unsplash: next/image solo carga hosts permitidos.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
