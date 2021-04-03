const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { packages } = require('./config');
const plugin = require('./util/plugin');

const resolveFile = function(names = []) {
  return path.join(__dirname, '..', 'packages', ...names)
}

const modules = [];

for(let i = 0; i < packages.length; i++) {
  const pkg = packages[i];
  modules.push({
    input: resolveFile([pkg.dirName, 'src', 'index.ts']),
    output: resolveFile([pkg.dirName, 'dist', 'index.global.js']),
    name: pkg.globalName,
    format: 'iife',
    // plugins: [plugin(pkg.dirName)]
  });
  modules.push({
    input: resolveFile([pkg.dirName, 'src', 'index.ts']),
    output: resolveFile([pkg.dirName, 'dist', 'index.cjs.js']),
    name: pkg.globalName,
    format: 'cjs',
    exports: 'default',
    plugins: [plugin(pkg.dirName)],
    external: [ '@draw/util' ]
  });
  modules.push({
    input: resolveFile([pkg.dirName, 'src', 'index.ts']),
    output: resolveFile([pkg.dirName, 'dist', 'index.es.js']),
    name: pkg.globalName,
    esModule: true,
    format: 'es',
    plugins: [plugin(pkg.dirName)]
  });
}


function createConfigItem(params) {
  const { input, output, name, format, plugins = [], esModule, exports} = params;
  return {
    input: input,
    output: {
      file:output,
      format,
      name: name,
      esModule: esModule === true,
      sourcemap: true,
      exports
    }, 
    plugins: [
      ...[nodeResolve(), typescript()],
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







