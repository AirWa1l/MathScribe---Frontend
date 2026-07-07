/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  // Destino del backend para el proxy de /api en desarrollo.
  // En Windows conviene 127.0.0.1 en vez de localhost (evita el salto a IPv6 ::1).
  const apiTarget = env.VITE_API_PROXY_TARGET || "http://127.0.0.1:8000";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Redirige las llamadas a la API al backend durante el desarrollo.
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    test: {
      // Pruebas de componentes con DOM simulado (Vitest + Testing Library).
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: false,
    },
  };
});
