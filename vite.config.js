import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwind()],
  server: { host: "localhost", hmr: { host: "localhost", port: 5173 } },
});
