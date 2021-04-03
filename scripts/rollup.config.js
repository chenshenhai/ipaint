const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const { packages } = require('./config');
const plugin = require('./util/plugin');

const resolveFile = function(names = []) {
  return path.join(__dirname, '..', 'packages', ...names)
}

const modules = packages.map((pkg) => {
  return {
    input: resolveFile([pkg.dirName, 'src', 'index.ts']),
    output: resolveFile([pkg.dirName, 'dist', 'index.js']),
    name: pkg.globalName,
    plugins: [plugin(pkg.dirName)]
  }
});

function createConfigItem(params) {
  const { input, output, name, plugins = []} = params;
  return {
    input: input,
    output: {
      file:output,
      format: 'umd',
      name: name,
      esModule: false,
      sourcemap: true,
    }, 
    plugins: [
      ...[typescript()],
      ...plugins,
    ],
  };
}

function createDevConfig(mods) {
  const configs = mods.map((mod) => {
    return createConfigItem(mod);
  });
  return configs;
}

module.exports = createDevConfig(modules);







