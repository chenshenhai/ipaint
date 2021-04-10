const { iDraw } = window;
const { demoData, IDraw } = iDraw;

const data = demoData.basic;
const canvas = document.querySelector('#canvas');
const idraw = new IDraw(canvas);

async function main() {
  await idraw.draw(data);
}
main();
