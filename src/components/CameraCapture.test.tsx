import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CameraCapture from "./CameraCapture";

/** Construye el error que lanza el navegador para cada situación real. */
function errorDeCamara(nombre: string): DOMException {
  return new DOMException("simulado", nombre);
}

function mockGetUserMedia(implementacion: () => Promise<MediaStream>) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: vi.fn(implementacion) },
  });
}

describe("CameraCapture", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, "mediaDevices");
  });

  it("explica cómo desbloquear cuando se deniega el permiso y ofrece reintentar", async () => {
    mockGetUserMedia(() => Promise.reject(errorDeCamara("NotAllowedError")));
    render(<CameraCapture onCapture={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /abrir la cámara/i }));

    const alerta = await screen.findByRole("alert");
    expect(alerta).toHaveTextContent(/bloqueaste el acceso/i);
    // El camino alternativo debe quedar visible: la app no queda inutilizable.
    expect(alerta).toHaveTextContent(/sube una imagen/i);
    expect(screen.getByRole("button", { name: /reintentar/i })).toBeInTheDocument();
  });

  it("distingue el caso de no tener cámara conectada", async () => {
    mockGetUserMedia(() => Promise.reject(errorDeCamara("NotFoundError")));
    render(<CameraCapture onCapture={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /abrir la cámara/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/no encontramos ninguna cámara/i);
  });

  it("avisa cuando el navegador no soporta la cámara y no ofrece reintentar", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });
    render(<CameraCapture onCapture={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /abrir la cámara/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/no permite acceder a la cámara/i);
    // Reintentar no tendría sentido: el navegador nunca va a soportarlo.
    expect(screen.queryByRole("button", { name: /reintentar/i })).not.toBeInTheDocument();
  });

  it("muestra la vista previa cuando se concede el permiso", async () => {
    const stream = { getTracks: () => [{ stop: vi.fn() }] } as unknown as MediaStream;
    mockGetUserMedia(() => Promise.resolve(stream));
    render(<CameraCapture onCapture={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /abrir la cámara/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /tomar foto/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("permite reintentar tras un fallo y abrir la cámara si ya hay permiso", async () => {
    const stream = { getTracks: () => [{ stop: vi.fn() }] } as unknown as MediaStream;
    let primeraLlamada = true;
    mockGetUserMedia(() => {
      if (primeraLlamada) {
        primeraLlamada = false;
        return Promise.reject(errorDeCamara("NotAllowedError"));
      }
      return Promise.resolve(stream);
    });
    render(<CameraCapture onCapture={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /abrir la cámara/i }));
    await userEvent.click(await screen.findByRole("button", { name: /reintentar/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /tomar foto/i })).toBeInTheDocument();
    });
  });
});
