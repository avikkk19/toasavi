import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named' 
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];
