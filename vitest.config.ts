import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["features/**/*.test.{ts,tsx}", "components/**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["text", "json-summary", "html"],
    },
  },
});
