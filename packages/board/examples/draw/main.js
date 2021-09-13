

async function main() {
  const { iPaintBoard } = window;
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

main();
