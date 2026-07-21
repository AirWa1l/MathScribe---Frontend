import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSolve } from "./useSolve";
import * as api from "../services/api";

vi.mock("../services/api");

const respuesta = {
  result: "\\frac{1}{3}",
  steps: [{ order: 1, description: "Integramos.", latex: "\\frac{x^3}{3}" }],
};

describe("useSolve", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("expone el resultado cuando la API responde", async () => {
    vi.mocked(api.solve).mockResolvedValue(respuesta);
    const { result } = renderHook(() => useSolve());

    await act(async () => {
      await result.current.run("\\int_0^1 x^2\\,dx");
    });

    expect(api.solve).toHaveBeenCalledWith("\\int_0^1 x^2\\,dx");
    expect(result.current.data).toEqual(respuesta);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("expone el mensaje de error cuando la API falla", async () => {
    vi.mocked(api.solve).mockRejectedValue(new Error("Error de resolución: 500"));
    const { result } = renderHook(() => useSolve());

    await act(async () => {
      await result.current.run("x^2");
    });

    await waitFor(() => expect(result.current.error).toBe("Error de resolución: 500"));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("reset descarta la resolución anterior", async () => {
    vi.mocked(api.solve).mockResolvedValue(respuesta);
    const { result } = renderHook(() => useSolve());

    await act(async () => {
      await result.current.run("x^2");
    });
    expect(result.current.data).not.toBeNull();

    act(() => result.current.reset());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
