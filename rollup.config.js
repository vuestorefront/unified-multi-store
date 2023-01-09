import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const extensions = ['.ts', '.js'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    nodeResolve({
      extensions
    }),
    typescript({
      // eslint-disable-next-line global-require
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: false
    })
  ]
};
