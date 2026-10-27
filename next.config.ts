import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Oculta el botón "N" de Next.js en desarrollo; los errores de compilación se siguen mostrando.
  devIndicators: false,
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
