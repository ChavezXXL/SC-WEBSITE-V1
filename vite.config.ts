import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 4317, host: '127.0.0.1' },
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
