# CoSpace

Plataforma fullstack de reservas de coworking en Next.js 16. Prueba de desempeño individual.

**Lee primero la especificación completa:** @docs/SRS.md
Maqueta visual: `docs/design/maqueta-cospace.html`.
Reglas de Next.js generadas por la plantilla (docs oficiales locales en `node_modules/next/dist/docs/`): @AGENTS.md

## Reglas de trabajo (resumen)

- Actúa como senior que supervisa a un junior: explica el porqué, avanza **un paso a la vez**, pregunta antes de asumir.
- Da bloques de código acotados y explicados; no generes el proyecto completo de golpe.
- **No uses agentes ni subagentes.**
- TypeScript estricto: nunca `any`; todo tipado.
- Git: `main` no se toca. Se trabaja en `develop` y en ramas `feat/*` que se integran con PR a `develop`. Commits convencionales.
- Las reglas de negocio (RN-01…RN-14 del SRS) se aplican en el backend, en `src/services/`.
- Next.js 16: `params`, `searchParams` y `cookies()` son asíncronos; la protección de rutas va en `src/proxy.ts`.
- Si el SRS y una petición chocan, señálalo y pregunta; si se decide un cambio, actualiza el SRS.
