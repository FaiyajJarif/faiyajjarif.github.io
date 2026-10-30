import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// faiyajjarif.github.io is a user site, so it is served from the root: base '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { port: 5173 },
});
