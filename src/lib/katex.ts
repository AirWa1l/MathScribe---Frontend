import katex from "katex";

/** Renderiza una cadena LaTeX a HTML usando KaTeX (PB-05). */
export function renderLatex(latex: string, displayMode = true): string {
  return katex.renderToString(latex, {
    displayMode,
    throwOnError: false,
  });
}
