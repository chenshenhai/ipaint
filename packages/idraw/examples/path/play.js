import data from './data.js';

const { IDraw, IDrawBrush } = window;

const canvas = document.querySelector('#canvas');
const iDraw = new IDraw(canvas);

async function main() {
  await iDraw.loadBrush({
    src: IDrawBrush.ink.src,
    size: 20,
  });
  await iDraw.play(data);
}
main();
