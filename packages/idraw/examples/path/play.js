const { IDraw, IDrawBrush, IDrawDemoData } = window;
const data = IDrawDemoData.basic;

const canvas = document.querySelector('#canvas');
const iDraw = new IDraw(canvas);

async function main() {
  await iDraw.play(data);
}
main();
