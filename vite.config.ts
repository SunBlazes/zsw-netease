import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
// @ts-ignore
import semi from "vite-plugin-semi-theme"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    semi({
      theme: "@douyinfe/semi-theme-default",
      options: { cssLayer: true },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: "inline",
  },
})
