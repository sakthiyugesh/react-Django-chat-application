import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // HTTP API proxy (for normal API requests)
      "/api": {
        target: "http://54.196.229.75:8000", // Backend API URL
        changeOrigin: true, // Optional: handles CORS issues by changing the Origin header
        // rewrite: (path) => path.replace(/^\/api/, ""), // Optionally rewrite paths if needed
      },
      // WebSocket proxy
      "/ws": {
        target: "ws://54.196.229.75:8000/", // WebSocket server URL
        ws: true, // This tells Vite to handle WebSocket traffic
        changeOrigin: true, // Optional: fixes CORS issues with WebSocket
      },
    },
  },
  
});
