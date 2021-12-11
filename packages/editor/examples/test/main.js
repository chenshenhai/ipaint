const { iPaint } = window;
const { IPaint } = iPaint;

async function main() {
  const dom = document.querySelector('#ipaint');

  const ipaint = new IPaint(dom, {
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
    console.log('ipaint ready!');
    // ipaint.setFacsimileImage('./images/copy.png');
  }).catch((err) => {
    console.log(err);
  });
}

main();
