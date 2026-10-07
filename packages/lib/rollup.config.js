import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default [{
    input: 'src/main.js',
    output: [
      {
        format: 'esm',
        file: pkg.module,
        sourcemap: true,
      }, {
        exports: 'named',
        format: 'cjs',
        file: pkg.main
      }, {
        file: pkg.unpkg,
        format: 'umd',
        name: 'Vue3SmoothDnD',
        sourcemap: true
      }
    ]
  }
]
