import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MetricsPanel from "./MetricsPanel";
import * as api from "../services/api";
import type { MetricsResponse } from "../types";

vi.mock("../services/api");

const METRICAS: MetricsResponse = {
  count: 12,
  errores: 1,
  uptime_s: 340.5,
  latency_ms: { p50: 120, p95: 1480, max: 1600, promedio: 410 },
  recursos: { cpu_percent: 8.34, memory_mb: 143.21 },
  gemini: {
    llamadas: 4,
    tokens_entrada: 1040,
    tokens_salida: 72,
    tokens_razonamiento: 2028,
    tokens_totales: 3140,
    costo_usd_estimado: 0.000942,
  },
  por_ruta: {
    "/api/v1/recognition": { count: 4, p50: 1350, p95: 1480 },
    "/api/v1/solve": { count: 8, p50: 90, p95: 130 },
  },
};

async function abrirPanel() {
  await userEvent.click(screen.getByRole("button", { name: /métricas técnicas/i }));
}

describe("MetricsPanel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("no consulta las métricas mientras el panel está cerrado", () => {
    render(<MetricsPanel />);
    expect(api.getMetrics).not.toHaveBeenCalled();
  });

  it("muestra las cifras al desplegar el panel", async () => {
    vi.mocked(api.getMetrics).mockResolvedValue(METRICAS);
    render(<MetricsPanel />);

    await abrirPanel();

    expect(await screen.findByText("12")).toBeInTheDocument();
    expect(screen.getByText("8.3 %")).toBeInTheDocument();
    expect(screen.getByText("143 MB")).toBeInTheDocument();
  });

  it("convierte a segundos las latencias de más de un segundo", async () => {
    vi.mocked(api.getMetrics).mockResolvedValue(METRICAS);
    render(<MetricsPanel />);

    await abrirPanel();

    expect(await screen.findByText("120 ms")).toBeInTheDocument();
    // Aparece tanto en el resumen como en la tabla por ruta.
    expect(screen.getAllByText(/1\.48 s/).length).toBeGreaterThan(0);
  });

  it("muestra costos muy pequeños sin redondearlos a cero", async () => {
    vi.mocked(api.getMetrics).mockResolvedValue(METRICAS);
    render(<MetricsPanel />);

    await abrirPanel();

    expect(await screen.findByText("$0.000942")).toBeInTheDocument();
  });

  it("desglosa la latencia por ruta", async () => {
    vi.mocked(api.getMetrics).mockResolvedValue(METRICAS);
    render(<MetricsPanel />);

    await abrirPanel();

    expect(await screen.findByText("/api/v1/recognition")).toBeInTheDocument();
    expect(screen.getByText("/api/v1/solve")).toBeInTheDocument();
  });

  it("informa del fallo sin romper la aplicación si el backend no responde", async () => {
    vi.mocked(api.getMetrics).mockRejectedValue(new Error("Error al consultar las métricas: 503"));
    render(<MetricsPanel />);

    await abrirPanel();

    expect(await screen.findByRole("alert")).toHaveTextContent(/503/);
  });

  it("indica cuándo todavía no hay peticiones medidas", async () => {
    vi.mocked(api.getMetrics).mockResolvedValue({ ...METRICAS, count: 0 });
    render(<MetricsPanel />);

    await abrirPanel();

    expect(await screen.findByText(/todavía no hay peticiones medidas/i)).toBeInTheDocument();
  });

  it("vuelve a consultar al pulsar Actualizar", async () => {
    vi.mocked(api.getMetrics).mockResolvedValue(METRICAS);
    render(<MetricsPanel />);

    await abrirPanel();
    await waitFor(() => expect(api.getMetrics).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole("button", { name: /actualizar/i }));

    await waitFor(() => expect(api.getMetrics).toHaveBeenCalledTimes(2));
  });
});
