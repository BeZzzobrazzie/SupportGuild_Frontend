import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    host: true
  },
  // optimizeDeps: {
  //   exclude: 
  //   include: Object.keys(pkg.dependencies),
  // },
});
