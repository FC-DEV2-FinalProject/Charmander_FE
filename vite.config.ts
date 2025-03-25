import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';
// import process from 'process'
// https://vite.dev/config/
export default defineConfig({
  //const env = loadEnv(mode, process.cwd());
  //const apiUrl = env.VITE_API_URL;
  plugins: [
    react(),
    TanStackRouterVite(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: 'node_modules', replacement: '/node_modules' },
    ],
  },
  /*
  server: {
    proxy: {
      '/api': {
        target: apiUrl,
        changeOrigin: true,
        secure: false,
      }
    }
  }
    */
});
