import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import pkg from './package.json';
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()
  //   , 
  //   basicSsl({
  //   name: 'test',
  //   domains: ['*.custom.com'],
  //   certDir: 'C:/Users/User/Desktop/cert'
  // })
],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    host: true,
    // https: true,
    // proxy: {
    //   "/foo": "https://192.168.0.190:5173/"
    // }
  },
  // optimizeDeps: {
  //   exclude: 
  //   include: Object.keys(pkg.dependencies),
  // },
});
