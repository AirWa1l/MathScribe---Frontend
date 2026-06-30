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
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-bold">MathScribe</h1>
        <p className="text-gray-600">
          Digitaliza contenido matemático a LaTeX y resuélvelo paso a paso.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ImageUploader onSelect={run} />
        <CameraCapture onCapture={run} />
      </section>

      {loading && <p className="text-gray-500">Reconociendo…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && <LatexResult latex={data.latex} />}
    </main>
  );
}
