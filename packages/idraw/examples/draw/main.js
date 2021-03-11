import { src } from "./brush/basic.js";

const { IDraw } = window;

const canvas = document.querySelector('#canvas');
const iDraw = new IDraw(canvas);

async function main() {
  await iDraw.loadBrush({ name: 'ink', src: src});
  iDraw.useBrush('ink');
  iDraw.setBrushSize(20);
  iDraw.start();
}

main();