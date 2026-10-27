# CoSpace — handoff de contexto (2026-10-27)

> Para una sesión nueva. Lee primero `CLAUDE.md`, `docs/SRS.md` y `AGENTS.md`; este archivo solo añade **el estado actual y lo aprendido**. No repitas lo que ya está en el SRS.

## 1. Cómo trabajar con el usuario

- El usuario es **junior** y yo soy el **senior que supervisa**. Un paso a la vez, explicar el porqué, preguntar antes de asumir, dar **bloques de código acotados** que él pega y entiende. Nada de generar el proyecto entero. Debe poder sustentar cada línea en vivo.
- **No usar agentes ni subagentes.** Hay 2 pestañas: ésta (backend) y la del frontend (sesión «Frontend CoSpace (UI)», carpeta `/home/cohorte5/Escritorio/CoSpace-frontend`, id `local_59fbf1e4-b774-4365-9793-26fa1eb13413`).
- Quiere **rapidez** (meta: terminar en 5 h; la prueba oficial dura 7 h) y **respuestas concisas**. Habla en español informal. Es muy estético: el diseño no debe parecer de IA.
- Respeta las reglas del enunciado: sin `any`, TypeScript estricto, IA solo como apoyo.
- **Credenciales:** nunca pedir ni leer tokens, `.env` ni claves. El `git push` lo ejecuta **él** (el equipo es compartido y el sistema bloquea mis push). Su llave SSH: `export GIT_SSH_COMMAND="ssh -i ~/.ssh/id_cospace -o IdentitiesOnly=yes"`. Recordarle cerrar sesión de GitHub y borrar la llave al terminar.

## 2. Entorno

- Repo backend: `/home/cohorte5/Escritorio/Prueba desempeño - Andres Elles` (ojo: existe un `.git` vacío en `~/Escritorio`, se ignora). Remoto: `https://github.com/dresanelles/CoSpace.git`.
- Next 16.4.3 (Turbopack), Node 24, drizzle-orm 0.45 / drizzle-kit 0.31, zod 4, jose, bcryptjs 3, next-intl, next-themes, swr.
- Puertos: **3000 = servidor del frontend**, **3001 = backend** (`npm run dev -- -p 3001`).
- Supabase: proyecto «Co Space» (plan free). `DATABASE_URL` = *Transaction pooler* (6543, con `prepare: false`), `DIRECT_URL` = *Session pooler* (5432, para migraciones). El `.env` está lleno; el editor oculta los valores con una extensión de «cloak».
- Admin del seed: `admin@cospace.com` / contraseña `SEED_ADMIN_PASSWORD` o por defecto `Admin123!` (documentarlo en el README; en producción usar otra).
- Usuario de prueba creado: `test@example.com` / `Test1234!` (rol `user`).

## 3. Git

`main` no se toca. Se trabaja en `develop` y en ramas `feat/*` con PR a `develop` (el usuario fusiona en GitHub; verificar siempre que la **base** sea `develop`).

PR fusionados: #1 B0 · #2 B1 (schema, migración, seed) · #3 UI foundation · #4 auth-api.

- Rama actual backend: `feat/spaces-api` (commit `4561633`, **falta push y PR**).
- Frontend (worktree): ramas locales sin push `feat/typography`, `public-pages`, `auth-pages`, `dashboard`, `admin-panel` e `i18n` (esta última acumula todas; commit `ca33e9e`). **Nada de eso está en GitHub aún**: hay que subirlo y fusionarlo a `develop`.
- Commits convencionales. Terminar los mensajes de commit con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` cuando los haga yo.

## 4. Lo construido (backend)

`src/db/{schema,index,seed}.ts` · `drizzle/0000_*.sql` (aplicada) · `src/lib/{errors,http,time,mappers}.ts` · `src/lib/auth/{constants,jwt,password,token-hash,cookies,session}.ts` · `src/lib/validation/{auth,spaces,common}.ts` · `src/services/{auth,spaces}.service.ts` · `src/app/api/auth/{register,login,refresh,logout,me}` · `src/app/api/spaces/{route,[id]/route,[id]/deactivate,[id]/availability}`.

Contrato de datos compartido: `src/types/api.ts` (DTO; los escribió la pestaña frontend).

Respuestas: `{ user }` (register 201, login 200, me), `204` en logout, `{ spaces }`, `{ space }`, `{ date, busyHours }`. Errores: `{ error: { code, message, details? } }` con 400/401/403/404/409.

Auth: access JWT 15 min y refresh JWT 7 d (con `jti`) en cookies `httpOnly`/`secure`/`sameSite=lax`, path `/`; el refresh se guarda **hasheado (SHA-256)** y se **rota** con un `UPDATE … WHERE revoked_at IS NULL` atómico. Los handlers validan sesión y rol con `requireAuth`/`requireAdmin`/`getOptionalSession`.

## 5. Decisiones y trampas ya resueltas

- Next 16: se desactivaron `cacheComponents` y `partialPrefetching` (modelo clásico: SSG Home, SSR `force-dynamic`, CSR con swr). `params` y `cookies()` son asíncronos.
- `rm -rf .next` borra los tipos generados: después correr `npx next typegen`.
- Zod 4: los límites `.max()` van **antes** de `.pipe()`.
- Hora del negocio = `America/Bogota` (UTC−5); `src/lib/time.ts` ya tiene `businessDayRange`, `businessHourOf`, `OPEN_HOUR=7`, `CLOSE_HOUR=21`.
- Las pruebas con curl no devuelven cookies `Secure` por http: para sesiones usar la extensión de Postman o el navegador.
- Ruido en *Problems*: SonarQube y cSpell (palabras en español). Solo cuentan `tsc` y `eslint`.
- `npm audit` marca 4 vulnerabilidades moderadas: no se ha ejecutado `audit fix`.

## 6. Pendiente (en este orden)

1. Push y PR de `feat/spaces-api`; probar con curl `GET /api/spaces?type=cabin`, un id inexistente (404) y `POST /api/spaces` sin sesión (401).
2. **Reservas** (`feat/reservations-api`): servicio con las 14 reglas del SRS (§6), dentro de una transacción con `SELECT … FOR UPDATE` sobre la fila del espacio (la misma que usa `deactivateSpace`); precio calculado en servidor; `idempotency_key` opcional (cabecera `Idempotency-Key`); rutas `GET/POST /api/reservations` y `POST /api/reservations/[id]/cancel`; `ReservationDTO` lleva un resumen del espacio. Añadir una prueba con `vitest` de al menos una regla.
3. `src/proxy.ts` (`feat/route-protection`): protege `(private)` y `(admin)`; si hay refresh pero no access válido, redirige a `GET /api/auth/refresh?next=…` (validar que `next` sea una ruta relativa propia). Falta ese `GET` en la ruta de refresh.
4. Extra: rate limiting en login.
5. Conectar el frontend a la API real (sustituir `src/mocks`), con la pestaña frontend, y probar de punta a punta.
6. `Dockerfile` (`output: "standalone"`, multi-stage), `README` completo (SRS §15), `.env.example`, despliegue en Vercel + Supabase, actualizar el SRS (i18n, bordes, respuestas de la API) y pasar la lista de verificación final.
7. Pulido visual y de UX con el tiempo sobrante.
