import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// The original Taiko Mass site, kept whole and served at iaos21.com/taiko-mass/.
// The essay pages next to it stay in ../public (root), as they always were.
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/taiko-mass/",
  publicDir: false,
  plugins: [react()],
  build: { outDir: "../dist/taiko-mass", emptyOutDir: false },
});
