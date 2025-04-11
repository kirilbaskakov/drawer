import react from "@vitejs/plugin-react";
import path from "path";
import { AliasOptions, defineConfig } from "vite";

const root = path.resolve(__dirname, "src");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
});
