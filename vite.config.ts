import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/BrandForgePro/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    // Ensure assets are properly referenced with the base path
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure proper asset paths for GitHub Pages
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  // Copy the 404.html file to the dist directory
  // This ensures GitHub Pages can handle client-side routing
  plugins: [
    react(),
    {
      name: 'copy-files',
      closeBundle() {
        // Copy 404.html to dist
        fs.copyFileSync(
          path.resolve(__dirname, 'public/404.html'),
          path.resolve(__dirname, 'dist/404.html')
        );
        // Copy CNAME to dist if it exists
        if (fs.existsSync(path.resolve(__dirname, 'public/CNAME'))) {
          fs.copyFileSync(
            path.resolve(__dirname, 'public/CNAME'),
            path.resolve(__dirname, 'dist/CNAME')
          );
        }
      },
    },
  ],
});
