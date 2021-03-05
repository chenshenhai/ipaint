const path = require('path');
const typescript = require('rollup-plugin-typescript2');

const resolveFile = function(names = []) {
  return path.join(__dirname, '..', 'packages', ...names)
}

const modules = [
  {
    input: resolveFile(['idraw', 'src', 'index.ts']),
    output: resolveFile(['idraw', 'dist', 'index.js']),
    name: 'IDraw',
  }
];

function createConfigItem(params) {
  const { input, output, name, } = params;
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
      typescript(),
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







