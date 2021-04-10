const { iDraw } = window;
const { brush, IDraw } = iDraw;
const { ink } = brush;

const canvas = document.querySelector('#canvas');
const btn = document.querySelector('#btn');
const idraw = new IDraw(canvas);

async function main() {
  await idraw.loadBrush({ name: 'ink', src: ink.src});
  idraw.useBrush('ink');
  idraw.setBrushSize(20);
  idraw.start();

  btn.addEventListener('click', () => {
    const data = idraw.getData();
    console.log(data);
    console.log(JSON.stringify(data));
  }, false);
}

main();