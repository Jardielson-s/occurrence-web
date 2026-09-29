import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// singlefile inlina JS e CSS no index.html, então o build abre direto
// com duplo clique (file://), sem servidor. Saída: ../frontend-dist
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
  build: { outDir: "../frontend-dist", emptyOutDir: true },
});
