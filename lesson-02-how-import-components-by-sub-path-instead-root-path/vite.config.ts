import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
    lib: {
      entry: {
        index: "src/index.ts",
        // "count-display": "src/count-down/count-display.ts",
        "count-down": "src/count-down/count-down.ts",
        "count-down-gang": "src/count-down-gang/count-down-gang.ts",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.es.js`,
    },
    rollupOptions: {
      external: [
        /^lit/,
      ],
      output: {
        preserveModules: false, // nếu set là true thì count-display.ts có thể không được bundle trong dist/count-down.es.js
        exports: "auto",
      },
    },
  },
});
