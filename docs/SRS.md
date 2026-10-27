# CoSpace — Especificación de requisitos (SRS)

> Fuente única de contexto del proyecto. Cualquier persona o IA que trabaje aquí debe leer este archivo primero.
> Origen: enunciado «Prueba de desempeño — Next.js 16» (Riwi, cohorte 5). Última actualización: 2026-10-27.
>
> Convención de estado: **[ENUNCIADO]** = obligatorio por el enunciado. **[DECISIÓN]** = decisión nuestra, cambiable si se acuerda. **[SUPUESTO]** = el enunciado es ambiguo y asumimos esto.

---

## 1. Propósito y alcance

**CoSpace** es una plataforma fullstack de reservas de espacios de coworking (escritorios, salas de reuniones y cabinas) por horas.

- Los **usuarios** se registran, inician sesión, exploran el catálogo y reservan o cancelan sus reservas.
- Los **administradores** gestionan el catálogo de espacios.
- **[ENUNCIADO]** No se consume ninguna API externa: todos los datos viven en nuestra base de datos y se exponen con route handlers de Next.js.

Fuera de alcance: pagos reales, notificaciones por correo, reservas recurrentes, múltiples sedes.

## 2. Reglas de colaboración (humano + IA)

El enunciado permite la IA solo como apoyo: sugerencias, correcciones, optimización y documentación. **Prohíbe** delegarle la solución completa. Además, la sustentación es en vivo y el autor debe explicar su código.

Cómo debe actuar la IA en este repositorio:

1. Rol de **senior developer que supervisa** a una persona junior. Guía, revisa y explica; no entrega el proyecto terminado.
2. **Paso a paso.** Un bloque de trabajo cada vez. Antes de cada paso: qué se hará y por qué. Después: cómo probarlo.
3. **No asumir conocimientos.** Si un concepto es nuevo, explicarlo; si hay ambigüedad, preguntar.
4. Dar **bloques de código acotados** que la persona escribe, adapta y entiende. No generar carpetas enteras de código sin explicación.
5. **No usar agentes ni subagentes.** Trabajo directo en la conversación.
6. TypeScript estricto: **nunca `any`**, todo tipado (cada variable o función sin tipar resta 1,5 % de la nota).
7. Individual: no copiar código de compañeros ni de soluciones completas externas. Citar la fuente si se adapta algo.

## 3. Flujo de trabajo en Git

- `main` **no se toca** hasta el cierre. (El repositorio local nace con `master`: renombrar a `main` al crear el primer commit.)
- Rama base de trabajo: **`develop`**.
- Cada feature va en su rama `feat/<nombre>` creada desde `develop` y se integra con **Pull Request a `develop`**.
- Commits pequeños en formato Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Solo se revisan commits dentro del plazo de la prueba: hacer commits frecuentes.
- Repositorio público: https://github.com/dresanelles/CoSpace.git

Ramas previstas (una por bloque, ver §14):
`feat/project-setup` · `feat/db-schema-seed` · `feat/auth-api` · `feat/spaces-api` · `feat/reservations-api` · `feat/route-protection` · `feat/ui-foundation` · `feat/public-pages` · `feat/auth-pages` · `feat/dashboard` · `feat/admin-panel` · `feat/i18n` · `feat/docker-deploy-readme` · (extras) `feat/tests-ci`

## 4. Roles

| Rol | Permisos |
|---|---|
| **Visitante** | Ver Home, catálogo y detalle de espacios. Registrarse e iniciar sesión. |
| **Usuario** (`user`) | Lo anterior + reservar y cancelar **sus propias** reservas, ver su dashboard. |
| **Administrador** (`admin`) | Lo anterior + crear, editar y desactivar espacios. **Se crea por seed**, nunca desde el registro público. |

## 5. Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | Registro de usuarios (nombre, correo, contraseña). El rol siempre es `user`. |
| RF-02 | Inicio de sesión con correo y contraseña. |
| RF-03 | Renovación del access token sin que el usuario vuelva a iniciar sesión. |
| RF-04 | Cierre de sesión que revoca el refresh token. |
| RF-05 | Catálogo público de espacios activos, con filtro por tipo. |
| RF-06 | Vista de detalle de un espacio con disponibilidad por fecha. |
| RF-07 | Un usuario autenticado reserva un espacio indicando fecha, hora de inicio y duración. |
| RF-08 | Un usuario ve el listado de **sus** reservas y puede cancelarlas. |
| RF-09 | El admin crea, edita y desactiva espacios desde un panel. |
| RF-10 | La interfaz está disponible en español e inglés con un selector visible. |
| RF-11 | La aplicación tiene **modo claro y oscuro** con selector visible, por defecto el del sistema, y la elección se recuerda. [DECISIÓN del autor] |

## 6. Reglas de negocio

Todas se garantizan **en el backend** (capa de servicio), no solo en la interfaz. Zona horaria de negocio **[SUPUESTO]**: `America/Bogota` (UTC−5, sin horario de verano). Las fechas se guardan en UTC (`timestamptz`).

### Reservas

| ID | Regla | Error |
|---|---|---|
| RN-01 | Duración de 1 a 4 horas, en horas completas (10:00–12:00 sí; 10:30–11:45 no). | 400 |
| RN-02 | Solo entre las 07:00 y las 21:00: inicio ≥ 07:00 y fin ≤ 21:00. | 400 |
| RN-03 | No en el pasado ni con más de 30 días de anticipación. | 400 |
| RN-04 | Un espacio no puede tener dos reservas **confirmadas** que se solapen. Si una termina a las 12:00, otra puede empezar a las 12:00. | 409 |
| RN-05 | Un usuario no puede tener dos reservas confirmadas que se solapen, **aunque sean en espacios distintos**. | 409 |
| RN-06 | Un usuario puede tener como máximo **3 reservas futuras confirmadas**. | 409 |
| RN-07 | No se puede reservar un espacio desactivado. | 409 |
| RN-08 | El precio total lo calcula el servidor: `horas × precio por hora`. Nunca se acepta del cliente. | — |

### Cancelación

| ID | Regla | Error |
|---|---|---|
| RN-09 | Solo el dueño de la reserva o un admin puede cancelarla. | 403 |
| RN-10 | Un usuario puede cancelar hasta **2 horas antes** del inicio. | 409 |
| RN-11 | Cancelar cambia el estado a `cancelled`. El registro **no se elimina**. | — |

### Espacios

| ID | Regla | Error |
|---|---|---|
| RN-12 | Un espacio no se elimina: se desactiva. Los desactivados no aparecen en el catálogo público. | — |
| RN-13 | No se puede desactivar un espacio con reservas futuras confirmadas. | 409 |

### Seguridad

| ID | Regla | Error |
|---|---|---|
| RN-14 | Un usuario no puede ver ni modificar reservas de otro usuario, aunque cambie el id en la URL. | 403 / 404 |

**Supuestos sobre las reglas** (confirmar con quien evalúa si es posible):
- Las reservas `cancelled` no cuentan para solapamientos (RN-04, RN-05) ni para el límite de 3 (RN-06).
- «Futuras» = su inicio es posterior al momento actual.
- El admin puede cancelar cualquier reserva sin la restricción de las 2 horas (RN-10 aplica al usuario).
- El código de estado de RN-10 es 409 (conflicto con el estado temporal de la reserva).
- Al listar «mis reservas» solo se devuelven las del usuario; en `cancel` sobre una ajena se responde 403.

## 7. Arquitectura y stack

| Capa | Elección | Estado |
|---|---|---|
| Framework | Next.js 16, App Router, TypeScript estricto | [ENUNCIADO] |
| Base de datos | PostgreSQL en **Supabase** | [ENUNCIADO] |
| ORM | **Drizzle ORM** + `postgres` (postgres-js) + `drizzle-kit` | [DECISIÓN] |
| Auth | `jose` (JWT) + `bcryptjs` (hash de contraseñas) | [DECISIÓN] |
| Validación | `zod` (esquemas compartidos entre handlers y formularios) | [DECISIÓN] |
| i18n | `next-intl` **sin routing por URL**; idioma en cookie | [DECISIÓN] |
| Tema claro/oscuro | `next-themes` (atributo `data-theme`) + variante `dark` de Tailwind v4 | [DECISIÓN] |
| Estilos | Tailwind CSS v4 | [DECISIÓN] |
| UI | `lucide-react`, `motion`, `sonner`, `date-fns`, `clsx` + `tailwind-merge`; shadcn/ui solo para Dialog, Select, Calendar | [DECISIÓN] |
| Fetch en cliente | `swr` | [DECISIÓN] |
| Pruebas | `vitest` (al menos una regla de negocio) | [DECISIÓN] |
| Contenedor | Docker (Dockerfile multi-stage, `output: "standalone"`) | [ENUNCIADO] |
| Despliegue | Vercel (app) + Supabase (BD) | [ENUNCIADO] |

Patrón interno: **route handler → servicio → ORM**. Los handlers solo validan la entrada, llaman al servicio y traducen errores de dominio a HTTP. Las reglas de negocio viven en `services/`.

### Estructura de carpetas

```
.
├─ docs/                      SRS, maqueta, notas
├─ drizzle/                   migraciones generadas
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           root layout
│  │  ├─ globals.css
│  │  ├─ (public)/            layout: navbar + footer
│  │  │  ├─ page.tsx          Home
│  │  │  └─ spaces/
│  │  │     ├─ page.tsx       catálogo
│  │  │     └─ [id]/page.tsx  detalle
│  │  ├─ (auth)/              layout: centrado y simple
│  │  │  ├─ login/page.tsx
│  │  │  └─ register/page.tsx
│  │  ├─ (private)/           layout: navbar con menú de usuario
│  │  │  └─ dashboard/page.tsx
│  │  ├─ (admin)/             layout: panel propio
│  │  │  └─ admin/
│  │  │     ├─ page.tsx
│  │  │     └─ spaces/{new,[id]/edit}/page.tsx
│  │  └─ api/
│  │     ├─ auth/{register,login,refresh,logout,me}/route.ts
│  │     ├─ spaces/route.ts
│  │     ├─ spaces/[id]/route.ts
│  │     ├─ spaces/[id]/deactivate/route.ts
│  │     ├─ spaces/[id]/availability/route.ts
│  │     ├─ reservations/route.ts
│  │     └─ reservations/[id]/cancel/route.ts
│  ├─ proxy.ts                protección de rutas (Next 16)
│  ├─ components/{ui,layout,spaces,reservations,admin}/
│  ├─ db/{index.ts,schema.ts,seed.ts}
│  ├─ lib/{auth,http,time,validation}/
│  ├─ services/{auth,spaces,reservations}.service.ts
│  ├─ i18n/{request.ts,messages/es.json,messages/en.json}
│  └─ types/
├─ Dockerfile
├─ .env.example
├─ drizzle.config.ts
└─ README.md
```

## 8. Rutas y estrategia de renderizado

| Ruta | Route group | Página | Renderizado | Acceso |
|---|---|---|---|---|
| `/` | (public) | Home | **SSG** [ENUNCIADO] | público |
| `/spaces` | (public) | Catálogo | **SSR** [ENUNCIADO] | público |
| `/spaces/[id]` | (public) | Detalle + reserva | **SSR** [ENUNCIADO] | público (reservar exige sesión) |
| `/login`, `/register` | (auth) | Autenticación | cliente (formularios) | público |
| `/dashboard` | (private) | Mis reservas | **CSR** [ENUNCIADO] | usuario autenticado |
| `/admin`, `/admin/spaces/...` | (admin) | Panel | cliente / servidor mixto | solo `admin` |

Layouts: root layout + uno por route group con diseño propio.

**[DECISIÓN] Modelo de renderizado clásico.** La plantilla de Next 16.4 activa por defecto `cacheComponents` y `partialPrefetching`; se **desactivaron** en `next.config.ts`. Con `cacheComponents` el contenido dinámico exige `<Suspense>` y deja de existir `export const dynamic`, lo que complica explicar SSG/SSR/CSR con los términos del enunciado. Con el modelo clásico:
- **SSG** (Home): página estática, sin datos por petición.
- **SSR** (catálogo y detalle): `export const dynamic = "force-dynamic"` para renderizar en cada petición.
- **CSR** (dashboard): componente cliente (`"use client"`) que carga los datos con `swr` desde `/api/reservations`.

Antes de escribir código de Next, consultar la documentación incluida en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## 9. Modelo de datos

Propuesta inicial (Drizzle). Dinero en pesos colombianos como entero (sin decimales).

**users**: `id` uuid PK · `email` text único · `name` text · `password_hash` text · `role` enum(`user`,`admin`) default `user` · `created_at` timestamptz

**spaces**: `id` uuid PK · `name` text · `description` text · `type` enum(`desk`,`meeting_room`,`cabin`) · `capacity` int · `price_per_hour` int · `image_url` text · `amenities` text[] · `is_active` bool default true · `created_at` timestamptz

**reservations**: `id` uuid PK · `user_id` → users · `space_id` → spaces · `starts_at` timestamptz · `ends_at` timestamptz · `total_price` int · `status` enum(`confirmed`,`cancelled`) · `cancelled_at` timestamptz null · `idempotency_key` text null único (extra) · `created_at` timestamptz

**refresh_tokens**: `id` uuid PK · `user_id` → users · `token_hash` text único · `expires_at` timestamptz · `revoked_at` timestamptz null · `created_at` timestamptz

Índices sugeridos: `reservations(space_id, starts_at)`, `reservations(user_id, status, starts_at)`, `refresh_tokens(user_id)`.

**Seed**: 1 admin (credenciales documentadas en el README) y unos 8 espacios variados (escritorios, salas, cabinas) con fotos de Unsplash.

## 10. Contrato de la API

Todas las respuestas de error tienen el mismo formato:

```json
{ "error": { "code": "RESERVATION_OVERLAP", "message": "Texto legible", "details": {} } }
```

Códigos HTTP: `400` validación · `401` sin sesión o token inválido · `403` sin permiso · `404` no existe · `409` conflicto de regla de negocio.

| Método y ruta | Descripción | Acceso |
|---|---|---|
| `POST /api/auth/register` | Crea usuario (rol `user`) e inicia sesión | público |
| `POST /api/auth/login` | Valida credenciales; fija cookies | público |
| `POST /api/auth/refresh` | Rota refresh token y emite nuevo access token | cookie refresh |
| `POST /api/auth/logout` | Revoca refresh token y borra cookies | autenticado |
| `GET /api/auth/me` | Usuario de la sesión actual | autenticado |
| `GET /api/spaces` | Lista espacios activos (`?type=`) | público |
| `POST /api/spaces` | Crea espacio | admin |
| `GET /api/spaces/[id]` | Detalle | público |
| `PATCH /api/spaces/[id]` | Edita espacio | admin |
| `POST /api/spaces/[id]/deactivate` | Desactiva (RN-13) | admin |
| `GET /api/spaces/[id]/availability?date=YYYY-MM-DD` | Horas ocupadas del día | público |
| `GET /api/reservations` | Reservas del usuario | usuario |
| `POST /api/reservations` | Crea reserva (`spaceId`, `startsAt`, `hours`) | usuario |
| `POST /api/reservations/[id]/cancel` | Cancela reserva | dueño o admin |

Los handlers **validan sesión y rol por su cuenta**, sin depender solo del proxy.

## 11. Autenticación y seguridad

- Contraseñas hasheadas con bcrypt.
- **Access token** (JWT, 15 min) y **refresh token** (7 días), ambos en cookies `httpOnly`, `secure`, `sameSite`. Nunca en `localStorage` ni en el cuerpo de la respuesta.
- El refresh token se guarda **hasheado** en BD (SHA-256), se **rota** en cada uso y el logout lo **revoca**.
- Renovación: el cliente reintenta tras un `401` llamando a `/api/auth/refresh`; el proxy redirige a la renovación cuando hay refresh cookie pero no access válido.
- `proxy.ts` (Next 16): redirige a `/login` si no hay sesión en rutas `(private)` y `(admin)`; devuelve acceso denegado a no-admins en `(admin)`.
- Validación de entrada con zod en todos los handlers. Sin secretos en el repositorio.
- Extras opcionales: rate limiting en login, idempotencia al crear reservas (cabecera `Idempotency-Key`).

### Notas técnicas de concurrencia
Para evitar dobles reservas simultáneas, crear la reserva dentro de una **transacción** que bloquee la fila del espacio (`SELECT … FOR UPDATE`) antes de comprobar solapamientos.

## 12. Internacionalización e hidratación

- Español (por defecto) e inglés, con selector visible en navbar. Idioma persistido en cookie.
- **Hidratación:** al menos un componente que dependa de datos del cliente (hora local en el dashboard, por ejemplo) sin errores de hidratación (renderizar tras montar o con `useSyncExternalStore`).
- Imágenes de espacios con `next/image` (`remotePatterns` para `images.unsplash.com`).

## 13. Diseño (UX/UI)

Referencia visual: [`docs/design/maqueta-cospace.html`](design/maqueta-cospace.html) (4 pantallas: Home, Catálogo, Detalle con widget de reserva funcional, Dashboard).

**Dirección:** estética tipo «zine / collage» editorial, moderna y con carácter. Inspirada en una referencia de moda; adaptada a coworking. Lo que NO debe parecer: plantilla genérica de IA.

**Tipografías** (vía `next/font/google`):
- Display: **Bricolage Grotesque** (variable, peso 800, ancho condensado, mayúsculas).
- Acento editorial: **Instrument Serif** cursiva.
- Etiquetas, precios, horas: **Geist Mono**.
- Notas a mano (uso mínimo, 1–2 sitios): **Caveat**.

**Paleta:**

| Token | Hex | Uso |
|---|---|---|
| `paper` | `#F3EFE6` | Fondo |
| `ink` | `#121212` | Texto y bordes |
| `lime` | `#D8F25A` | Escritorios · acentos · estado confirmada |
| `sky` | `#AFCBF2` | Salas de reuniones |
| `pink` | `#F5A9C4` | Cabinas |

**Modo oscuro** (RF-11). Se invierten papel y tinta; los pasteles se mantienen porque funcionan sobre fondo oscuro:

| Token | Claro | Oscuro |
|---|---|---|
| `paper` (fondo) | `#F3EFE6` | `#151412` |
| `ink` (texto y bordes) | `#121212` | `#F3EFE6` |
| `surface` (tarjetas elevadas, widget) | `#FFFFFF` | `#211F1C` |
| `mute` (texto secundario) | `#6B675E` | `#A8A397` |
| `lime` / `sky` / `pink` | sin cambio | sin cambio |
| `on-pastel` (texto sobre un pastel) | `#121212` | `#121212` (siempre oscuro) |

Regla clave: **el texto sobre un fondo pastel usa siempre `on-pastel`**, no `ink`, o se vuelve ilegible en modo oscuro.

Implementación: tokens como variables CSS en `globals.css`, redefinidas bajo `[data-theme="dark"]`. `next-themes` con `attribute="data-theme"`, `defaultTheme="system"` y `enableSystem`; `<html suppressHydrationWarning>`. El botón del selector debe renderizarse **solo tras montar** (el servidor no conoce el tema del usuario), para no causar errores de hidratación. La maqueta incluye un botón de ejemplo.

El color identifica el **tipo de espacio**. Bordes de 1,5 px en tinta, esquinas moderadas, sombra «dura» (offset sin difuminar) solo en el widget de reserva.

**Componentes clave:** tarjeta de espacio con precio como sticker rotado (~3°), chips de filtro, selector de hora (07–20) con horas ocupadas tachadas y duración 1–4 h limitada por las reglas, total calculado en vivo, estados de reserva como etiquetas.

**Evitar:** degradados morados, glassmorphism, Inter por defecto, sombras difusas, emojis como iconos, esquinas todas muy redondeadas. Movimiento sutil (entrada suave y hover con carácter).

**Accesibilidad:** contraste suficiente, foco visible, botones y chips operables con teclado.

## 14. Plan por bloques (simulacro de 5 h)

El enunciado da 7 h (06:00–13:00, con descansos). Objetivo propio: terminar en 5 h y dejar 2 h de colchón.

| Bloque | Min. acum. | Contenido | Rama |
|---|---|---|---|
| B0 | 0:00–0:20 | Proyecto Next, dependencias, estructura, `.env.example`, ramas | `feat/project-setup` |
| B1 | 0:20–1:00 | Schema, migración, seed | `feat/db-schema-seed` |
| B2 | 1:00–2:15 | `lib/`, servicios, rutas de auth, spaces y reservations, `proxy.ts` | `feat/auth-api`, `feat/spaces-api`, `feat/reservations-api`, `feat/route-protection` |
| B3 | 2:15–3:55 | Tokens de diseño, layouts, componentes, 7 páginas | `feat/ui-foundation`, `feat/public-pages`, `feat/auth-pages`, `feat/dashboard`, `feat/admin-panel` |
| B4 | 3:55–4:20 | i18n, hidratación, `next/image` | `feat/i18n` |
| B5 | 4:20–5:00 | Dockerfile, README, deploy, prueba en producción | `feat/docker-deploy-readme` |

Prioridad si falta tiempo: reglas de negocio y auth → deploy y README → pulido visual → extras.

## 15. Entregables y variables de entorno

`.env.example` (sin valores reales):

```env
DATABASE_URL=
DIRECT_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

`DATABASE_URL` = cadena del *pooler* de Supabase (puerto 6543, usar con `prepare: false`). `DIRECT_URL` = conexión directa o de sesión (5432), solo para migraciones. **[DECISIÓN]** El enunciado de ejemplo usa `JWT_ACCESS_SECRET`; mantener esos nombres.

**README** (entregable evaluado; debe permitir ejecutar todo partiendo de cero): descripción · requisitos previos · explicación de cada variable y de dónde sale · pasos en desarrollo en orden (clonar e instalar → crear `.env` → migraciones → seed → `dev`) · credenciales del admin del seed · ejecución con Docker y cómo pasar las variables · scripts de `package.json` · estructura de carpetas · URL desplegada.

**Entrega:** repositorio público en GitHub + en Moodle un TXT con el enlace y un ZIP del código.

## 16. Calidad del código

- TypeScript sin `any`; `strict` activado; regla de ESLint contra `any`.
- Nombres claros, funciones de una sola responsabilidad, sin duplicación.
- Componentes compartidos reutilizables con organización clara.
- Al menos una prueba automática de una regla de negocio (extra).

## 17. Lista de verificación final

- [ ] Las 14 reglas de negocio se cumplen en backend (probado con peticiones directas)
- [ ] Cookies `httpOnly`/`secure`/`sameSite`; nada en `localStorage`
- [ ] Refresh hasheado en BD, rotado y revocado en logout
- [ ] `proxy.ts` protege `(private)` y `(admin)`; los handlers revalidan rol
- [ ] SSG en Home, SSR en catálogo y detalle, CSR en dashboard
- [ ] i18n es/en con selector visible; sin errores de hidratación
- [ ] `next/image` en imágenes de espacios
- [ ] Modo claro/oscuro con selector, persistente y sin parpadeo ni errores de hidratación
- [ ] Migraciones + seed funcionan desde cero
- [ ] Dockerfile construye y ejecuta
- [ ] `.env.example` completo; sin secretos en el repo
- [ ] README probado siguiéndolo literalmente
- [ ] Desplegado en Vercel + Supabase y probado en producción
- [ ] Sin `any`; lint y build limpios
