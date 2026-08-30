import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const rawHosts = process.env.ALLOWED_HOSTS || process.env.DOMAIN || process.env.VITE_ALLOWED_HOSTS
const allowedHosts =
  !rawHosts || rawHosts === "*" || rawHosts === "all" || rawHosts === "true"
    ? true
    : rawHosts.split(",").map((h) => h.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, ""))

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  server: {
    host: true,
    allowedHosts,
  },
  preview: {
    host: true,
    allowedHosts,
  },
})

export default config
