import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    proxy: { '/api': `http://localhost:3000` },
  },
});
