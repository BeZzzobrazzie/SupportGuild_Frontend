// vite.config.ts
import { defineConfig } from "file:///C:/home/code/file-manager_v.2/node_modules/vite/dist/node/index.js";
import react from "file:///C:/home/code/file-manager_v.2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { TanStackRouterVite } from "file:///C:/home/code/file-manager_v.2/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    TanStackRouterVite()
    //   , 
    //   basicSsl({
    //   name: 'test',
    //   domains: ['*.custom.com'],
    //   certDir: 'C:/Users/User/Desktop/cert'
    // })
  ],
  resolve: {
    alias: {
      src: "/src"
    }
  },
  server: {
    host: true
    // https: true,
    // proxy: {
    //   "/foo": "https://192.168.0.190:5173/"
    // }
  }
  // optimizeDeps: {
  //   exclude: 
  //   include: Object.keys(pkg.dependencies),
  // },
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxob21lXFxcXGNvZGVcXFxcZmlsZS1tYW5hZ2VyX3YuMlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcaG9tZVxcXFxjb2RlXFxcXGZpbGUtbWFuYWdlcl92LjJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2hvbWUvY29kZS9maWxlLW1hbmFnZXJfdi4yL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgdml0ZVJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSAnQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZSdcclxuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbic7XHJcbmltcG9ydCBiYXNpY1NzbCBmcm9tICdAdml0ZWpzL3BsdWdpbi1iYXNpYy1zc2wnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBUYW5TdGFja1JvdXRlclZpdGUoKVxyXG4gIC8vICAgLCBcclxuICAvLyAgIGJhc2ljU3NsKHtcclxuICAvLyAgIG5hbWU6ICd0ZXN0JyxcclxuICAvLyAgIGRvbWFpbnM6IFsnKi5jdXN0b20uY29tJ10sXHJcbiAgLy8gICBjZXJ0RGlyOiAnQzovVXNlcnMvVXNlci9EZXNrdG9wL2NlcnQnXHJcbiAgLy8gfSlcclxuXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBzcmM6IFwiL3NyY1wiLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIC8vIGh0dHBzOiB0cnVlLFxyXG4gICAgLy8gcHJveHk6IHtcclxuICAgIC8vICAgXCIvZm9vXCI6IFwiaHR0cHM6Ly8xOTIuMTY4LjAuMTkwOjUxNzMvXCJcclxuICAgIC8vIH1cclxuICB9LFxyXG4gIC8vIG9wdGltaXplRGVwczoge1xyXG4gIC8vICAgZXhjbHVkZTogXHJcbiAgLy8gICBpbmNsdWRlOiBPYmplY3Qua2V5cyhwa2cuZGVwZW5kZW5jaWVzKSxcclxuICAvLyB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUixTQUFTLG9CQUFvQjtBQUM5UyxPQUFPLFdBQVc7QUFFbEIsU0FBUywwQkFBMEI7QUFLbkMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQUcsbUJBQW1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPeEM7QUFBQSxFQUNFLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
