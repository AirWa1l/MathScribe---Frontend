import { renderLatex } from "../lib/katex";
import type { SolutionStep } from "../types";

interface Props {
  steps: SolutionStep[];
}

/** Muestra la explicación paso a paso de la resolución (PB-08). */
export default function SolutionSteps({ steps }: Props) {
  if (steps.length === 0) return null;

  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step) => (
        <li key={step.order} className="rounded-lg border border-gray-200 p-3">
          <p className="text-gray-700">{step.description}</p>
          {step.latex && (
            <div dangerouslySetInnerHTML={{ __html: renderLatex(step.latex) }} />
          )}
        </li>
      ))}
    </ol>
  );
}
