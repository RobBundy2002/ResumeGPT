import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ResumeGPT/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['dist/**', 'tests/**', 'src/main.tsx', 'src/test/**', '*.config.*', 'src/**/*.d.ts', 'src/types/**'],
    },
  },
});
