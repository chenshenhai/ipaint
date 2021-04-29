const { iDraw } = window;
const { IDraw } = iDraw;

async function main() {
  const dom = document.querySelector('#idraw');

  const idraw = new IDraw(dom, {
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
    
    // canvasScale: Math.max(window.innerWidth / 2479, window.innerHeight / 3508)
    // canvasScale: Math.max(2479 / window.innerWidth, 3508 / window.innerHeight)
  });
  
  idraw.ready().then(() => {
    console.log('idraw ready!')
  }).catch((err) => {
    console.log(err);
  });
}

main();
