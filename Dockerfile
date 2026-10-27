# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

# 1) Dependencias (capa cacheable mientras no cambien package*.json)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 2) Compilación. No necesita variables de entorno: la conexión a la base de datos es perezosa.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Imagen final: solo el servidor "standalone" de Next, sin node_modules completos.
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Las variables de entorno (DATABASE_URL, JWT_*, ...) se pasan al ejecutar el contenedor.
CMD ["node", "server.js"]
