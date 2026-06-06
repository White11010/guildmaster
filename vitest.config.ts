import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/shared/testing/setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/index.ts']
    }
  }
});
