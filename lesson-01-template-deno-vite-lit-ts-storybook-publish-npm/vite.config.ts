import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => `index.es.js`,
    },
    rollupOptions: {
      external: [
        /^lit/,
      ],
    },
  },
});
