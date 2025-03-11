
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force date-fns à utiliser une version spécifique
      "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
    },
    dedupe: ['date-fns', 'react-day-picker']
  },
  // Optimize build output for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keeping console.log for debugging
        drop_debugger: true,
      },
    },
    // Gérer plus précisément les dépendances et les avertissements
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore specific warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.message.includes('date-fns') ||
            warning.message.includes('peer dependency') ||
            warning.message.includes('react-day-picker')) {
          return;
        }
        warn(warning);
      },
      // Ajouter des external pour éviter les duplications
      external: [],
      // Optimiser la génération du bundle
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          dateFns: ['date-fns']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['date-fns', 'react-day-picker'],
    force: true,
    esbuildOptions: {
      // Résoudre les problèmes de version
      resolveExternal: true
    }
  }
}));
