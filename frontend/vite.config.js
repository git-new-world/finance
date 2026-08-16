import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/finance/",
  plugins: [react()],
  server: { host: '0.0.0.0', port: 9092, strictPort: true, allowedHosts: true, hmr: { clientPort: 443, protocol: 'wss' } }
});
