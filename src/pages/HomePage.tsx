import { useEffect } from "react";

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

  const latex = data?.latex ?? "";
  const sinExpresion = data !== null && latex.trim() === "";
  const { reset } = solucion;

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

      {sinExpresion && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No se reconoció ninguna expresión matemática en la imagen. Prueba con
          mejor iluminación y encuadrando solo la expresión.
        </div>
      )}

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
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {solucion.loading ? "Resolviendo…" : "Resolver"}
              </button>
            </div>

            {solucion.error && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {solucion.error}
              </p>
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
