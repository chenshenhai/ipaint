const { iDraw } = window;
const { Board } = iDraw;

async function main() {
  const dom = document.querySelector('#idraw-board');

  const idraw = new Board(dom, {
    width: 400,
    height: 320,
    devicePixelRatio: window.devicePixelRatio
  });
  
  idraw.start().then(() => {
    console.log('idraw ready!');
  }).catch((err) => {
    console.log(err);
  });
}

main();
