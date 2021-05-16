const { iDraw } = window;
const { Paint } = iDraw;

async function main() {
  const dom = document.querySelector('#idraw');

  const paint = new Paint(dom, {
    width: window.innerWidth,
    height: window.innerHeight,

    // 72px
    // canvasWidth: 595,
    // canvasHeight: 842,

    // 150px
    canvasWidth: 1240,
    canvasHeight: 1754,

    // 300 px
    // canvasWidth: 2479,
    // canvasHeight: 3508,
  });
  
  paint.ready().then(() => {
    console.log('paint ready!');
    // paint.setFacsimileImage('./images/copy.png');
  }).catch((err) => {
    console.log(err);
  });
}

main();
