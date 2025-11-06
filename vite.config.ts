import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // treat entire Tauri API namespace as external at build time
        "@tauri-apps/api",
        "@tauri-apps/api/*",
        // specific modules (optional, covered by wildcard)
        "@tauri-apps/api/core",
        "@tauri-apps/api/dialog",
        "@tauri-apps/api/fs",
        "@tauri-apps/api/path",
        "@tauri-apps/api/http"
      ]
    }
  }
});
