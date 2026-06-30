// Cliente HTTP de la API de MathScribe.

import type { RecognitionResponse, SolveResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

/** Envía una imagen al backend y obtiene su representación en LaTeX (PB-04). */
export async function recognize(image: File): Promise<RecognitionResponse> {
  const form = new FormData();
  form.append("image", image);

  const res = await fetch(`${BASE_URL}/recognition`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Error de reconocimiento: ${res.status}`);
  return res.json();
}

/** Solicita la resolución y explicación paso a paso de una expresión (PB-07, PB-08). */
export async function solve(latex: string): Promise<SolveResponse> {
  const res = await fetch(`${BASE_URL}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latex }),
  });
  if (!res.ok) throw new Error(`Error de resolución: ${res.status}`);
  return res.json();
}
