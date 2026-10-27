# CoSpace

Plataforma fullstack de **reservas de espacios de coworking** (escritorios, salas de reuniones y cabinas) por horas. Los usuarios se registran, exploran el catálogo y reservan o cancelan sus reservas; los administradores gestionan el catálogo de espacios.

- **Stack:** Next.js 16 (App Router) · TypeScript estricto · Tailwind CSS v4 · PostgreSQL en Supabase · Drizzle ORM · JWT en cookies `httpOnly` · next-intl (es/en) · modo claro/oscuro.
- **Aplicación desplegada:** https://TU-APP.vercel.app  <!-- TODO: reemplazar por la URL real de Vercel -->

## 1. Requisitos previos

| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | 22 LTS o superior (mínimo 20.9) | ejecutar el proyecto |
| npm | 10 o superior (viene con Node) | gestor de paquetes |
| Git | cualquiera reciente | clonar el repositorio |
| Cuenta de Supabase | plan gratuito | base de datos PostgreSQL |
| Docker | 24 o superior (opcional) | ejecutar con contenedor |
| Cuenta de Vercel | plan gratuito (opcional) | desplegar |

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa cada valor. **Nunca subas el `.env` al repositorio.**

| Variable | Para qué sirve | Qué valor lleva y de dónde sale |
|---|---|---|
| `DATABASE_URL` | Conexión de la aplicación a la base de datos | Cadena del **Transaction pooler** (puerto `6543`) de Supabase |
| `DIRECT_URL` | Conexión para las migraciones | Cadena del **Session pooler** (puerto `5432`) de Supabase |
| `JWT_ACCESS_SECRET` | Firma los access tokens | Secreto aleatorio (ver abajo) |
| `JWT_REFRESH_SECRET` | Firma los refresh tokens | Otro secreto aleatorio, **distinto** al anterior |
| `ACCESS_TOKEN_EXPIRES_IN` | Vida del access token | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Vida del refresh token | `7d` |
| `SEED_ADMIN_PASSWORD` | *(opcional)* contraseña del admin que crea el seed | Si no se define, se usa la indicada en la sección 4 |

### Cómo obtener las cadenas de conexión en Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) y **guarda la contraseña de la base de datos** (no se puede volver a ver).
2. Entra en el proyecto y pulsa **Connect** (barra superior).
3. Copia la cadena del **Transaction pooler** (puerto 6543) en `DATABASE_URL`.
4. Copia la cadena del **Session pooler** (puerto 5432) en `DIRECT_URL`. Usa esta y no la *Direct connection*, que suele ser solo IPv6.
5. Sustituye `[YOUR-PASSWORD]` por tu contraseña. Si contiene caracteres especiales (`@`, `:`, `/`, `#`), escríbelos codificados en URL (por ejemplo `@` → `%40`).

### Cómo generar los secretos de los tokens

```bash
openssl rand -base64 48
```

Ejecuta el comando dos veces y pega cada resultado en `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`. Los valores van sin comillas.

## 3. Ejecución en desarrollo

Ejecuta estos comandos, en este orden:

```bash
# 1. Clonar el repositorio e instalar dependencias
git clone https://github.com/dresanelles/CoSpace.git
cd CoSpace
npm install

# 2. Crear el .env a partir del ejemplo y completarlo (sección 2)
cp .env.example .env

# 3. Ejecutar las migraciones (crea las tablas en Supabase)
npm run db:migrate

# 4. Ejecutar el seed (crea el administrador y 8 espacios de ejemplo)
npm run db:seed

# 5. Levantar el proyecto en modo desarrollo
npm run dev
```

La aplicación queda en http://localhost:3000.

## 4. Credenciales del administrador

Las crea el seed (`npm run db:seed`). El rol de administrador **no se puede obtener desde el registro público**.

| Campo | Valor |
|---|---|
| Correo | `admin@cospace.com` |
| Contraseña | `Admin123!` (o el valor de `SEED_ADMIN_PASSWORD` si lo definiste) |

El seed es idempotente: puedes ejecutarlo varias veces sin duplicar datos.

## 5. Ejecución con Docker

La imagen no incluye secretos: las variables se pasan al ejecutar el contenedor. Antes, ejecuta las migraciones y el seed desde tu máquina (secciones 3.3 y 3.4).

```bash
# Construir la imagen
docker build -t cospace .

# Ejecutar el contenedor pasando las variables desde tu .env
docker run --rm -p 3000:3000 --env-file .env cospace
```

Con Docker Compose:

```bash
docker compose up --build
```

La aplicación queda en http://localhost:3000.

## 6. Scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Next.js |
| `npm run build` | Compila la aplicación para producción (no requiere variables de entorno) |
| `npm run start` | Sirve la compilación de producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Ejecuta las pruebas unitarias con Vitest |
| `npm run db:generate` | Genera una nueva migración SQL a partir de `src/db/schema.ts` |
| `npm run db:migrate` | Aplica las migraciones pendientes a la base de datos |
| `npm run db:seed` | Crea el administrador y los espacios de ejemplo |

## 7. Estructura de carpetas

```
.
├─ docs/                      SRS, maqueta de diseño y notas
├─ drizzle/                   migraciones SQL generadas
├─ public/                    archivos estáticos e imágenes de espacios
└─ src/
   ├─ app/
   │  ├─ (public)/            Home (SSG), catálogo y detalle del espacio (SSR)
   │  ├─ (auth)/              login y registro
   │  ├─ (private)/           dashboard de reservas del usuario (CSR)
   │  ├─ (admin)/             panel de administración
   │  └─ api/                 route handlers: auth, spaces, reservations
   ├─ components/             componentes compartidos (ui, layout, spaces, reservations, admin)
   ├─ db/                     esquema de Drizzle, conexión y seed
   ├─ i18n/                   configuración y mensajes es/en
   ├─ lib/                    utilidades: errores, HTTP, tiempo, auth (JWT, cookies), validación
   ├─ services/               lógica de negocio (auth, espacios, reservas) y sus reglas
   ├─ types/                  tipos compartidos entre cliente y servidor
   └─ proxy.ts                protección de rutas privadas y de administración
```

## 8. Reglas de negocio y seguridad

Todas las reglas se aplican **en el backend** (`src/services`), no solo en la interfaz. Resumen:

- Reservas de 1 a 4 horas completas, entre las 07:00 y las 21:00 (hora de Bogotá), sin pasado ni más de 30 días de anticipación.
- Sin solapamientos en un espacio ni para un mismo usuario; máximo 3 reservas futuras confirmadas por usuario.
- El precio lo calcula siempre el servidor (`horas × precio por hora`).
- Solo el dueño o un administrador puede cancelar; el usuario, hasta 2 horas antes del inicio. Cancelar no borra el registro.
- Los espacios se desactivan, no se eliminan, y no se pueden desactivar con reservas futuras confirmadas.
- Autenticación con access token (15 min) y refresh token (7 días) en cookies `httpOnly`, `secure` y `sameSite`. El refresh token se guarda hasheado en la base de datos, se rota en cada uso y se revoca al cerrar sesión.
- Los route handlers validan la sesión y el rol por su cuenta; `proxy.ts` es una primera barrera adicional.

El detalle completo está en [`docs/SRS.md`](docs/SRS.md).

## 9. API

Todos los errores usan el formato `{ "error": { "code", "message", "details?" } }` con códigos 400, 401, 403, 404 o 409.

| Método y ruta | Descripción | Acceso |
|---|---|---|
| `POST /api/auth/register` · `login` · `refresh` · `logout` | Registro, inicio de sesión, renovación y cierre de sesión | público / sesión |
| `GET /api/auth/me` | Usuario de la sesión actual | autenticado |
| `GET /api/spaces` | Lista espacios activos (`?type=`) | público |
| `POST /api/spaces` · `PATCH /api/spaces/[id]` | Crear y editar espacio | admin |
| `POST /api/spaces/[id]/deactivate` | Desactivar espacio | admin |
| `GET /api/spaces/[id]` · `/availability?date=` | Detalle y horas ocupadas | público |
| `GET /api/reservations` · `POST /api/reservations` | Mis reservas y crear reserva | autenticado |
| `POST /api/reservations/[id]/cancel` | Cancelar reserva | dueño o admin |

## 10. Despliegue

La base de datos vive en **Supabase** y la aplicación en **Vercel**:

1. Ejecuta migraciones y seed contra Supabase (secciones 3.3 y 3.4).
2. Importa el repositorio en Vercel.
3. En *Settings → Environment Variables* define las seis variables de la sección 2 (usa `DATABASE_URL` con el *Transaction pooler*).
4. Despliega. Cada `push` a la rama de producción redespliega automáticamente.
