import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    },
    host: true, // Here
    proxy: {
      "^/(assistants|threads|ingest|runs|auth)": {
        target: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8100",
        changeOrigin: true,
        false: true,
        rewrite: (path) => path.replace("/____LANGSERVE_BASE_URL", ""),
      },
    },
  },
  base: process.env.VITE_BACKEND_URL || "http://127.0.0.1:8100",
});
