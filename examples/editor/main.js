

async function main() {
  const dom = document.querySelector('#ipaint');
  const { iPaintEditor } = window;
  const ipaint = new iPaintEditor(dom, {
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
  
  ipaint.ready().then(() => {
    console.log('paint ready!');
    // paint.setFacsimileImage('./images/copy.png');
  }).catch((err) => {
    console.log(err);
  });
}

main();
