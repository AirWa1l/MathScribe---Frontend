# MathScribe — Frontend

SPA de **MathScribe**, el agente visual multimodal para la digitalización, conversión a
LaTeX y resolución de contenido matemático.

> Universidad del Valle · Programa de Ingeniería de Sistemas · Proyecto Integrador 2 (2026)

Es la **capa de presentación** de la arquitectura: captura desde la cámara, envía la
imagen a reconocer, muestra el LaTeX para que el usuario lo verifique y presenta la
resolución paso a paso renderizada con KaTeX. Consume la API del repositorio
[`MathScribe---Backend`](https://github.com/AirWa1l/MathScribe---Backend).

## Stack

React · TypeScript · Vite · Tailwind CSS · KaTeX. Calidad con ESLint + Prettier y Vitest.

## Estructura

```
src/
  components/   CameraCapture, ImageUploader, LatexResult,
                SolutionSteps, MetricsPanel
  pages/        HomePage (flujo completo: captura → LaTeX → resolución)
  hooks/        useRecognition, useSolve (estado de las llamadas a la API)
  services/     api.ts (cliente HTTP: recognize, solve, getMetrics)
  lib/          katex.ts (render de LaTeX)
  types/        tipos espejo de los esquemas de la API
```

## Flujo de la aplicación

1. **Captura** desde la cámara (`getUserMedia`) o carga de un archivo. Ambas vías
   están disponibles desde el inicio: denegar el permiso de cámara no inutiliza la
   aplicación.
2. **Reconocimiento**: la imagen se envía a `POST /recognition` y se muestra el LaTeX
   devuelto, renderizado con KaTeX y copiable al portapapeles.
3. **Verificación**: el usuario confirma que la transcripción es correcta. Resolver
   es una acción explícita, no automática — evita resolver el problema equivocado
   cuando el reconocimiento falla.
4. **Resolución**: `POST /solve` devuelve el resultado y los pasos, que se muestran
   con su explicación y un aviso permanente de verificar el resultado.
5. **Métricas**: un panel colapsable consulta `GET /metrics` y muestra el desempeño
   real del backend.

## Puesta en marcha (desarrollo)

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173 (proxy /api → http://localhost:8000)
```

## Scripts

| Comando         | Descripción                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Servidor de desarrollo (Vite)        |
| `npm run build` | Build de producción                  |
| `npm run lint`  | ESLint                               |
| `npm run test`  | Pruebas con Vitest                   |
| `npm run test:cov` | Pruebas con reporte de cobertura  |

## Configuración

| Variable | Desarrollo | Producción |
|---|---|---|
| `VITE_API_BASE_URL` | `/api/v1` (Vite hace proxy al backend) | URL pública de la API |
| `VITE_API_PROXY_TARGET` | `http://127.0.0.1:8000` | no aplica |

Vite **incrusta estas variables durante el build**, no en tiempo de ejecución: cambiar
`VITE_API_BASE_URL` obliga a reconstruir el sitio.

## Despliegue

Sitio estático en Render, definido como código en [`render.yaml`](./render.yaml). El
pipeline ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) ejecuta lint,
pruebas con cobertura y build; sólo en `main`, y sólo si todo pasa, dispara el
despliegue mediante el Deploy Hook.

## Documentación

- [`docs/design/mockups.md`](./docs/design/mockups.md) — interfaz, estados y accesibilidad.
- [`docs/product/riesgos.md`](./docs/product/riesgos.md) — registro de riesgos.
- [`docs/product/backlog-sprint2.md`](./docs/product/backlog-sprint2.md) — backlog del producto.
- Documentación del sistema completo: [`MathScribe---Backend/docs`](https://github.com/AirWa1l/MathScribe---Backend/tree/main/docs).
