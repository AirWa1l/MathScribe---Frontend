import { useCallback, useState } from "react";

import { solve } from "../services/api";
import type { SolveResponse } from "../types";

/** Encapsula el estado de la resolución paso a paso (cargando, error, resultado). */
export function useSolve() {
  const [data, setData] = useState<SolveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(latex: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await solve(latex));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  /** Descarta la resolución anterior al reconocer una expresión distinta.
   *
   * Se memoiza porque los componentes la usan como dependencia de un efecto;
   * una identidad nueva en cada render dispararía el efecto sin necesidad.
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, run, reset };
}
