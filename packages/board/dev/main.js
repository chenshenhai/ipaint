import iPaintBoard from '../src';

async function main() {
  const dom = document.querySelector('#ipaint-board');
  const board = new iPaintBoard(dom, {
    width: 400,
    height: 320,
    devicePixelRatio: window.devicePixelRatio
  });

  board.render();
  // board.on('draw', console.log);
  
  // board.start().then(() => {
  //   console.log('ipaint ready!');
  // }).catch((err) => {
  //   console.log(err);
  // });
}

// redraw
// async function main() {
//   const { iPaintBoard, iPaintDemoData } = window;
//   const demoData = iPaintDemoData;
//   const dom = document.querySelector('#ipaint-board');

//   const board = new iPaintBoard(dom, {
//     width: 500,
//     height: 500,
//     devicePixelRatio: window.devicePixelRatio
//   });
  
//   board.render();
//   board.allowDraw(false);
//   board.setData(demoData.basic);
//   // board.redraw();

//   board.prepare().then(() => {
//     board.redraw();
//   }).catch((err) => {
//     console.log(err);
//   });

//   // setTimeout(() => {
//   //   board.allowDraw(true);
//   // }, 2000);
// }

main();
