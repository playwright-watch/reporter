// @file: rollup.config.js
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const config = [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
        exports: 'default',
      },
    ],
    plugins: [esbuild()],
  },
  {
    input: './src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default config;
