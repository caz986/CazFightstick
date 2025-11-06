import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Prevent bundling of the Tauri JS runtime — treat these as external
      external: [
        "@tauri-apps/api",
        "@tauri-apps/api/*",
        "@tauri-apps/api/core",
        "@tauri-apps/api/dialog",
        "@tauri-apps/api/fs",
        "@tauri-apps/api/path"
      ]
    }
  }
});
