import { useCallback, useEffect, useState } from "react";

import { getMetrics } from "../services/api";
import type { MetricsResponse } from "../types";

/** Formatea una duración en milisegundos, pasando a segundos cuando es larga. */
function ms(valor: number): string {
  if (valor >= 1000) return `${(valor / 1000).toFixed(2)} s`;
  return `${valor.toFixed(0)} ms`;
}

/** Formatea un costo en dólares, con precisión suficiente para valores mínimos. */
function usd(valor: number): string {
  if (valor === 0) return "$0.00";
  if (valor < 0.01) return `$${valor.toFixed(6)}`;
  return `$${valor.toFixed(2)}`;
}

function Dato({ etiqueta, valor, detalle }: { etiqueta: string; valor: string; detalle?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <dt className="text-xs uppercase tracking-wider text-gray-400">{etiqueta}</dt>
      <dd className="mt-1 text-lg font-medium text-gray-900">{valor}</dd>
      {detalle && <p className="text-xs text-gray-500">{detalle}</p>}
    </div>
  );
}

/**
 * Panel de métricas técnicas del backend (PB-14 a PB-16).
 *
 * Va colapsado por omisión: es información de diagnóstico, no parte del flujo
 * principal de quien usa la aplicación para resolver un ejercicio.
 */
export default function MetricsPanel() {
  const [datos, setDatos] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setDatos(await getMetrics());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  // Sólo se consulta al desplegar el panel: pedir métricas que nadie está
  // mirando añadiría tráfico y, de paso, alteraría lo que se quiere medir.
  useEffect(() => {
    if (abierto && datos === null && !cargando) void cargar();
  }, [abierto, datos, cargando, cargar]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setAbierto((previo) => !previo)}
        aria-expanded={abierto}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Métricas técnicas
        </span>
        <span aria-hidden="true" className="text-gray-400">
          {abierto ? "−" : "+"}
        </span>
      </button>

      {abierto && (
        <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              Acumuladas desde que arrancó el servicio.
            </p>
            <button
              type="button"
              onClick={() => void cargar()}
              disabled={cargando}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? "Actualizando…" : "Actualizar"}
            </button>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              No se pudieron obtener las métricas. {error}
            </p>
          )}

          {datos && datos.count === 0 && !error && (
            <p className="text-sm text-gray-500">
              Todavía no hay peticiones medidas. Reconoce o resuelve una
              expresión y vuelve a actualizar.
            </p>
          )}

          {datos && datos.count > 0 && (
            <>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Dato
                  etiqueta="Peticiones"
                  valor={String(datos.count)}
                  detalle={`${datos.errores} con error`}
                />
                <Dato
                  etiqueta="Latencia p50"
                  valor={ms(datos.latency_ms.p50)}
                  detalle={`p95 ${ms(datos.latency_ms.p95)}`}
                />
                <Dato etiqueta="CPU" valor={`${datos.recursos.cpu_percent.toFixed(1)} %`} />
                <Dato etiqueta="Memoria" valor={`${datos.recursos.memory_mb.toFixed(0)} MB`} />
              </dl>

              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Dato
                  etiqueta="Llamadas al modelo"
                  valor={String(datos.gemini.llamadas)}
                />
                <Dato
                  etiqueta="Tokens"
                  valor={datos.gemini.tokens_totales.toLocaleString("es")}
                  detalle={`${datos.gemini.tokens_razonamiento.toLocaleString("es")} de razonamiento`}
                />
                <Dato
                  etiqueta="Costo estimado"
                  valor={usd(datos.gemini.costo_usd_estimado)}
                />
              </dl>

              {Object.keys(datos.por_ruta).length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Latencia por endpoint</caption>
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-gray-400">
                        <th scope="col" className="py-1">Ruta</th>
                        <th scope="col" className="py-1 text-right">Peticiones</th>
                        <th scope="col" className="py-1 text-right">p50</th>
                        <th scope="col" className="py-1 text-right">p95</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {Object.entries(datos.por_ruta).map(([ruta, m]) => (
                        <tr key={ruta} className="border-t border-gray-100">
                          <td className="py-1 font-mono text-xs">{ruta}</td>
                          <td className="py-1 text-right">{m.count}</td>
                          <td className="py-1 text-right">{ms(m.p50)}</td>
                          <td className="py-1 text-right">{ms(m.p95)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
