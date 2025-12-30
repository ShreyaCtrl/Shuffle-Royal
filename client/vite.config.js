import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    allowedHosts: ["72f5672a3fd1.ngrok-free.app"],
  },
});
