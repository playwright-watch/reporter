// @file: rollup.config.js
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import copy from 'rollup-plugin-copy';

const config: RollupOptions[] = [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
        exports: 'default',
        assetFileNames: '*.md',
      },
    ],
    plugins: [
      esbuild(),
      copy({
        targets: [
          {
            src: ['package.json', 'LICENSE', 'README.md'],
            dest: 'dist',
          },
          {
            src: './src/*',
            dest: 'dist/src',
          },
        ],
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default config;
