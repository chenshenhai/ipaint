const path = require('path');
const typescript = require('rollup-plugin-typescript2');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: {
      file: resolveFile('dist/index.js'),
      format: 'umd',
      name: 'IDraw',
      esModule: false,
    }, 
    plugins: [
      typescript(),
    ],
  },
]