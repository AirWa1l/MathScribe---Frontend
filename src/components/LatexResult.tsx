import { renderLatex } from "../lib/katex";

interface Props {
  latex: string;
}

/** Render del LaTeX y copia al portapapeles (PB-05, PB-06). */
export default function LatexResult({ latex }: Props) {
  function copy() {
    void navigator.clipboard.writeText(latex);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <div dangerouslySetInnerHTML={{ __html: renderLatex(latex) }} />
      <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-sm">{latex}</pre>
      <button
        type="button"
        onClick={copy}
        className="self-start rounded bg-gray-800 px-3 py-1 text-sm text-white hover:bg-gray-700"
      >
        Copiar LaTeX
      </button>
    </div>
  );
}
