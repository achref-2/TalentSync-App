import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://achref-2.github.io/TalentSync-App/ on GitHub Pages.
  base: process.env.VITE_BASE ?? '/TalentSync-App/',
  plugins: [react()],
  server: {
    port: 3000,
  },
});
