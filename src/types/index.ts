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
