import { useState } from "react";

import { recognize } from "../services/api";
import type { RecognitionResponse } from "../types";

/** Encapsula el estado de la llamada de reconocimiento (cargando, error, resultado). */
export function useRecognition() {
  const [data, setData] = useState<RecognitionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(image: File) {
    setLoading(true);
    setError(null);
    try {
      setData(await recognize(image));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, run };
}
