import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { triodeGlslifyPlugin } from "./scripts/build/vite-glslify-plugin.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildSourcemap = process.env.BUILD_SOURCEMAP === "true";

export default defineConfig({
  plugins: [triodeGlslifyPlugin()],
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 8000,
    open: "/dev/index.html",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/triode-synth.js"),
      name: "Triode",
      formats: ["umd"],
      fileName: () => "triode.js",
    },
    sourcemap: buildSourcemap,
    minify: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        exports: "default",
      },
    },
  },
});
