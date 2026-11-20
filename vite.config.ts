import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths make the built site easier to host in a subdirectory.
  base: './',
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
});
