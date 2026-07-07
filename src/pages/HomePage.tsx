import CameraCapture from "../components/CameraCapture";
import ImageUploader from "../components/ImageUploader";
import LatexResult from "../components/LatexResult";
import { useRecognition } from "../hooks/useRecognition";

/**
 * Pantalla principal del MVP: captura/carga de imagen → render del LaTeX reconocido.
 * La resolución paso a paso se engancha aquí una vez disponible el endpoint.
 */
export default function HomePage() {
  const { data, loading, error, run } = useRecognition();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 font-serif text-2xl text-white shadow-md">
          ∑
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          MathScribe
        </h1>
        <p className="max-w-md text-gray-500">
          Digitaliza contenido matemático a LaTeX y resuélvelo paso a paso.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">
          Captura tu problema
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploader onSelect={run} />
          <CameraCapture onCapture={run} />
        </div>
      </section>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-gray-500 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
          Reconociendo…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && <LatexResult latex={data.latex} />}
    </main>
  );
}
