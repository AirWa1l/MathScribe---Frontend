import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LatexResult from "./LatexResult";

describe("LatexResult", () => {
  it("muestra el código LaTeX recibido dentro de un <pre>", () => {
    const latex = "x^2 + 1";
    const { container } = render(<LatexResult latex={latex} />);

    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre).toHaveTextContent(latex);
  });

  it("expone el botón para copiar el LaTeX", () => {
    render(<LatexResult latex="a + b" />);

    expect(
      screen.getByRole("button", { name: /copiar latex/i }),
    ).toBeInTheDocument();
  });
});
