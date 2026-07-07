import { useState } from "react";

import { renderLatex } from "../lib/katex";

interface Props {
  latex: string;
}

/** Render del LaTeX y copia al portapapeles (PB-05, PB-06). */
export default function LatexResult({ latex }: Props) {
  const [copiado, setCopiado] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(latex);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">
        Resultado
      </h2>

      <div
        className="overflow-x-auto py-2 text-gray-900"
        dangerouslySetInnerHTML={{ __html: renderLatex(latex) }}
      />

      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
        {latex}
      </pre>

      <button
        type="button"
        onClick={copy}
        className="self-start rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
      >
        {copiado ? "¡Copiado!" : "Copiar LaTeX"}
      </button>
    </section>
  );
}
