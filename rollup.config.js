import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-css-only';
import nodeResolve from 'rollup-plugin-node-resolve';

const createBabelConfig = require('./babel.config');

const { root } = path.parse(process.cwd());
const external = (id) => !id.startsWith('.') && !id.startsWith(root);
const extensions = ['.js', '.ts', '.tsx'];
const getBabelOptions = (targets) => ({
  ...createBabelConfig({ env: (env) => env === 'build' }, targets),
  extensions,
});

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: 'named',
  },
  external,
  plugins: [
    nodeResolve(),
    typescript({
      typescript: require('typescript'),
      tsconfigOverride: { compilerOptions: { declaration: false } },
    }),
    css({
      output: 'lib/styles.css',
    }),
  ],
};
