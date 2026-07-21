import { useCallback, useEffect, useState } from "react";

import CameraCapture from "../components/CameraCapture";
import ImageUploader from "../components/ImageUploader";
import LatexResult from "../components/LatexResult";
import SolutionSteps from "../components/SolutionSteps";
import { useRecognition } from "../hooks/useRecognition";
import { useSolve } from "../hooks/useSolve";
import { renderLatex } from "../lib/katex";

/**
 * Pantalla principal: captura/carga de imagen → LaTeX reconocido → resolución
 * paso a paso. El usuario verifica el LaTeX antes de resolver, porque un
 * reconocimiento equivocado produciría una respuesta correcta al problema
 * equivocado.
 */
export default function HomePage() {
  const { data, loading, error, run } = useRecognition();
  const solucion = useSolve();
  // Se conserva la última imagen para poder reintentar sin obligar a la persona
  // a volver a capturarla cuando el fallo fue de red o del servidor.
  const [ultimaImagen, setUltimaImagen] = useState<File | null>(null);

  const latex = data?.latex ?? "";
  const sinExpresion = data !== null && latex.trim() === "";
  const { reset } = solucion;

  const reconocer = useCallback(
    (imagen: File) => {
      setUltimaImagen(imagen);
      run(imagen);
    },
    [run],
  );

  // Al reconocer una expresión distinta, la solución anterior deja de ser válida.
  useEffect(() => {
    reset();
  }, [latex, reset]);

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
          <ImageUploader onSelect={reconocer} />
          <CameraCapture onCapture={reconocer} />
        </div>
      </section>

      {/* Los cambios de estado se anuncian a los lectores de pantalla, que de
          otro modo no percibirían que la aplicación está trabajando. */}
      <div aria-live="polite" className="contents">
        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-gray-500 shadow-sm">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800"
            />
            Reconociendo…
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>No pudimos procesar la imagen. {error}</p>
            {ultimaImagen && (
              <button
                type="button"
                onClick={() => run(ultimaImagen)}
                className="self-start rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Reintentar
              </button>
            )}
          </div>
        )}

        {sinExpresion && (
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            No se reconoció ninguna expresión matemática en la imagen. Prueba con
            mejor iluminación y encuadrando solo la expresión.
          </div>
        )}
      </div>

      {latex && (
        <>
          <LatexResult latex={latex} />

          <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Resolución
              </h2>
              <button
                type="button"
                onClick={() => solucion.run(latex)}
                disabled={solucion.loading}
                aria-label="Resolver la expresión reconocida paso a paso"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {solucion.loading ? "Resolviendo…" : "Resolver"}
              </button>
            </div>

            {solucion.error && (
              <div
                role="alert"
                className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <p>No pudimos resolver la expresión. {solucion.error}</p>
                <button
                  type="button"
                  onClick={() => solucion.run(latex)}
                  className="self-start rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Reintentar
                </button>
              </div>
            )}

            {solucion.data && (
              <div className="flex flex-col gap-4">
                {solucion.data.result && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-gray-400">
                      Resultado
                    </p>
                    <div
                      className="overflow-x-auto py-1 text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: renderLatex(solucion.data.result),
                      }}
                    />
                  </div>
                )}

                {solucion.data.steps.length > 0 ? (
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-wider text-gray-400">
                      Paso a paso
                    </p>
                    <SolutionSteps steps={solucion.data.steps} />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No fue posible descomponer esta expresión en pasos. Revisa
                    que el LaTeX reconocido sea correcto.
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  Verifica siempre el resultado: el reconocimiento de la imagen
                  puede equivocarse.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
