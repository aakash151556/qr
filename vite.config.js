import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'  // ✅ FIXED

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(), // ✅ correct usage
  ],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['tronweb'],
  },
})