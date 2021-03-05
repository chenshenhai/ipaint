import { src } from "./brush/basic.js";

const { IDraw } = window;

const canvas = document.querySelector('#canvas');
const iDraw = new IDraw(canvas);

async function main() {
  await iDraw.loadBrush({
    src: src,
    size: 40,
  });
  iDraw.start();
}

main();