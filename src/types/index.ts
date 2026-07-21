// Tipos compartidos del cliente, alineados con los esquemas de la API.

export interface RecognitionResponse {
  latex: string;
  confidence: number;
  provider: string;
}

export interface SolutionStep {
  order: number;
  description: string;
  latex?: string | null;
}

export interface SolveResponse {
  result: string;
  steps: SolutionStep[];
}

/** Métricas técnicas del backend (`GET /metrics`). */
export interface MetricsResponse {
  count: number;
  errores: number;
  uptime_s: number;
  latency_ms: {
    p50: number;
    p95: number;
    max: number;
    promedio: number;
  };
  recursos: {
    cpu_percent: number;
    memory_mb: number;
  };
  gemini: {
    llamadas: number;
    tokens_entrada: number;
    tokens_salida: number;
    tokens_razonamiento: number;
    tokens_totales: number;
    costo_usd_estimado: number;
  };
  por_ruta: Record<string, { count: number; p50: number; p95: number }>;
}
