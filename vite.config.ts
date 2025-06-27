import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages configuration
  base: '/CrystalHarp-Sampler/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    
    // Optimize for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['tone']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,
    open: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  }
})
