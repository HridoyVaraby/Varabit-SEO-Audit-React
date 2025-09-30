// Simple config with correct JSX transform
export default {
  plugins: [],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  }
}
