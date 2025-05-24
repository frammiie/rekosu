import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  vite: {
    server: {
      host: process.env.HOST,
    },
  },
});
