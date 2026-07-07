import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ImageUploader from "./ImageUploader";

describe("ImageUploader", () => {
  it("llama a onSelect con el archivo elegido", async () => {
    const onSelect = vi.fn();
    const { container } = render(<ImageUploader onSelect={onSelect} />);

    const input = container.querySelector<HTMLInputElement>(
      'input[type="file"]',
    );
    expect(input).not.toBeNull();

    const file = new File(["contenido"], "ecuacion.png", {
      type: "image/png",
    });
    await userEvent.upload(input!, file);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(file);
  });
});
