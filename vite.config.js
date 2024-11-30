import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: '../dist', // Ensures build output is at the project root
    emptyOutDir: true,
  },
});
