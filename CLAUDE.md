# CLAUDE.md — Frontend

Guía para sesiones con Claude Code en el frontend de MathScribe.

## Qué es esto

SPA en React + TypeScript (Vite) que captura contenido matemático, lo envía al backend y
renderiza el LaTeX resultante con KaTeX. Estilos con Tailwind CSS.

## Mapa del código

- `src/pages/HomePage.tsx` — pantalla principal y orquestación del flujo del MVP.
- `src/components/` — `ImageUploader` (PB-02), `CameraCapture` (PB-01),
  `LatexResult` (PB-05/06), `SolutionSteps` (PB-08).
- `src/hooks/useRecognition.ts` — estado de la llamada de reconocimiento.
- `src/services/api.ts` — cliente HTTP; única puerta hacia el backend.
- `src/lib/katex.ts` — helper de render de LaTeX.
- `src/types/` — tipos espejo de los esquemas de la API.

## Convenciones

- Componentes funcionales con hooks; un componente por archivo, export default.
- Las llamadas a la API pasan siempre por `src/services/api.ts` (no usar `fetch` suelto).
- ESLint + Prettier; Conventional Commits; ramas `feature/*` y `fix/*`.
- Textos de interfaz y comentarios en español.

## Comandos

```bash
npm run dev    # desarrollo
npm run build  # build de producción
npm run lint   # ESLint
```

> Estado actual: andamiaje. Componentes y servicios devuelven/usan datos de ejemplo;
> la cámara y la conexión real con la API están marcadas con TODO.
