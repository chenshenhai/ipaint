const execa = require('execa');

execa(
  'rollup',
  [
    '-w',
    '-c',
    './scripts/rollup.config.js'
  ],
  {
    stdio: 'inherit'
  }
)