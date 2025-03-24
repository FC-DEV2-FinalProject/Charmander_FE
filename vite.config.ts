import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
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
});