import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'triode-shader-loader',
      transform(code, id) {
        const cleanId = id.split('?', 1)[0]
        if (cleanId.endsWith('.frag') || cleanId.endsWith('.vert')) {
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: null,
          }
        }
      },
    },
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/triode-synth.js',
        'src/lib/clock.js',
        'src/format-arguments.js',
        'src/three/runtime.js',
        'src/three/rnd.js',
      ],
      thresholds: {
        lines: 70,
        functions: 60,
        branches: 50,
        statements: 70,
      },
    },
  },
})
