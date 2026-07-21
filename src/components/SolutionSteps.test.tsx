import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SolutionSteps from "./SolutionSteps";
import type { SolutionStep } from "../types";

const pasos: SolutionStep[] = [
  { order: 1, description: "Aplicamos la regla de la potencia.", latex: "\\frac{x^3}{3}" },
  { order: 2, description: "Evaluamos entre los límites.", latex: null },
];

describe("SolutionSteps", () => {
  it("muestra la descripción de cada paso en orden", () => {
    render(<SolutionSteps steps={pasos} />);

    const elementos = screen.getAllByRole("listitem");
    expect(elementos).toHaveLength(2);
    expect(elementos[0]).toHaveTextContent("Aplicamos la regla de la potencia.");
    expect(elementos[1]).toHaveTextContent("Evaluamos entre los límites.");
  });

  it("no renderiza nada cuando no hay pasos", () => {
    const { container } = render(<SolutionSteps steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("tolera pasos sin LaTeX asociado", () => {
    render(<SolutionSteps steps={[{ order: 1, description: "Sólo texto." }]} />);
    expect(screen.getByText("Sólo texto.")).toBeInTheDocument();
  });
});
