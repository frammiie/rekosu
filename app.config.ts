import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  ssr: true,
  vite: {
    server: {
      host: process.env.HOST,
    },
  },
});
