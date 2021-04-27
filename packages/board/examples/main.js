const { iDraw } = window;
const { Board } = iDraw;

async function main() {
  const dom = document.querySelector('#idraw-board');

  const board = new Board(dom, {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: 2479,
    canvasHeight: 3508,
  });
  
  board.ready().then(() => {
    console.log('board ready!')
  }).catch((err) => {
    console.log(err);
  });
}

main();
