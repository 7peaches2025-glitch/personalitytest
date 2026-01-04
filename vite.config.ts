// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.VERCEL || process.env.CF_PAGES ? '/' : '/personalitytest/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        // 允许在 Less 文件中使用 JavaScript
        javascriptEnabled: true,
      },
    },
  },
});