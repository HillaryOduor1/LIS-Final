/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: [
        "defaults",
          "not IE 11",
          "> 0.5%",
          "last 2 versions",
          "Firefox ESR",
          "Chrome >= 49",
          "Safari >= 10",
          "Edge >= 15",
          "iOS >= 10",
          "Android >= 5",
      ],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      renderLegacyChunks: true,
      modernPolyfills: true,
    })
  ],
  build: {
    target: "es2015",
    
    //rollupOptions: { external: [] },
  },
  server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
      
    },
});

