import path from './data/path.js';

const { IDraw } = window;

const canvas = document.querySelector('#canvas');
const iDraw = new IDraw(canvas);

setTimeout(() => {
  // iDraw.start();
  iDraw.drawPath({
    positions: [
      {"x":50,"y":50,"t":10},
      {"x":100,"y":100,"t":20},
      {"x":150,"y":150,"t":30},
      {"x":200,"y":200,"t":40},
      {"x":250,"y":250,"t":50},
      {"x":300,"y":300,"t":60}
    ],
    // positions: path.positions
  });
}, 2000)