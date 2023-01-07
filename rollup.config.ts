import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const external = [
  'fs/promises',
  'path',
  'axios',
  'consola',
  'yargs',
  'yargs/helpers',
  '@supabase/supabase-js',
];

const config: RollupOptions[] = [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        assetFileNames: '*.md',
      },
    ],
    external,
    plugins: [
      esbuild(),
      json(),
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
    output: [{ file: 'dist/index.d.ts', format: 'cjs' }],
    plugins: [dts()],
  },
  {
    input: './src/cli.ts',
    output: [
      {
        file: 'dist/cli.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
    ],
    external,
    plugins: [esbuild(), json()],
  },
];

export default config;
