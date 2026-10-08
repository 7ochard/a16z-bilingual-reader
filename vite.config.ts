import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // Rollup 4.64.2 hangs while tree-shaking this React 19 bundle on Node 24.
    // Keep production minification; disable only Rollup's affected optimization.
    rollupOptions: { treeshake: false },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: { "/api": "http://127.0.0.1:3001" },
  },
});
