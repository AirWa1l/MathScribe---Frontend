# MathScribe — Frontend

SPA de **MathScribe**, el agente visual multimodal para la digitalización, conversión a
LaTeX y resolución de contenido matemático.

> Universidad del Valle · Programa de Ingeniería de Sistemas · Proyecto Integrador 2 (2026)

Es la **capa de presentación** de la arquitectura: gestiona la captura de cámara, la carga
de imágenes y el render de LaTeX con KaTeX. Consume la API del repositorio
[`MathScribe---Backend`](https://github.com/AirWa1l/MathScribe---Backend).

## Stack

React · TypeScript · Vite · Tailwind CSS · KaTeX. Calidad con ESLint + Prettier y Vitest.

## Estructura

```
src/
  components/   CameraCapture, ImageUploader, LatexResult, SolutionSteps
  pages/        HomePage (flujo principal del MVP)
  hooks/        useRecognition (estado de la llamada a la API)
  services/     api.ts (cliente HTTP)
  lib/          katex.ts (render de LaTeX)
  types/        tipos compartidos con la API
```

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

> ⚠️ Andamiaje inicial: la captura por cámara y la integración real con la API están
> esbozadas (`TODO`) y se completan en historias posteriores del backlog.
