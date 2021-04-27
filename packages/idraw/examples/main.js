const { iDraw } = window;
const { IDraw } = iDraw;

async function main() {
  const dom = document.querySelector('#idraw');

  const idraw = new IDraw(dom, {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: 2479,
    canvasHeight: 3508,
  });
  
  idraw.ready().then(() => {
    console.log('idraw ready!')
  }).catch((err) => {
    console.log(err);
  });
}

main();
