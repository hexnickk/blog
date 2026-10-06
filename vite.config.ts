import { reactRouter } from "@react-router/dev/vite";
import stylex from "@stylexjs/unplugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: false }), reactRouter(), tsconfigPaths()],
});
