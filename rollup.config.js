import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import typescript from 'rollup-plugin-typescript2';
import css from 'rollup-plugin-css-only';

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
    typescript(),
    babel(getBabelOptions({ node: 8 })),
    sizeSnapshot(),
    resolve({ extensions }),
    css({
      output: 'lib/styles.css',
    }),
  ],
};
