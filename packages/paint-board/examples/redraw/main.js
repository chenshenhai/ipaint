const { iDraw } = window;
const { PaintBoard, demoData } = iDraw;

async function main() {
  const dom = document.querySelector('#idraw-board');

  const board = new PaintBoard(dom, {
    width: 500,
    height: 500,
    devicePixelRatio: window.devicePixelRatio
  });
  
  board.start();
  board.allowDraw(false);
  board.setData(demoData.basic);
  // board.redraw();

  board.prepare().then(() => {
    board.redraw();
  }).catch((err) => {
    console.log(err);
  });

  // setTimeout(() => {
  //   board.allowDraw(true);
  // }, 2000);
}

main();
