const { iDraw } = window;
const { demoData, util, Core } = iDraw;
const data = demoData.basic;

async function main() {
  const canvas = document.querySelector('#canvas');
  const context = canvas.getContext('2d');
  const core = new Core(context);

  const image = await util.loader.loadImage(data.brushMap.ink.src);
  
  data.paths.forEach(async (path) => {
    core.setBrush({
      name: 'ink',
      pattern: image,
      maxSize: path.size,
      minSize: 0,
    });

    path.positions.forEach(async (p, i) => {
      if (i === 0) {
        core.drawStart();
      } else if (i === path.positions.length - 1) {
        core.pushPosition(p);
        core.drawEnd();
      } else {
        core.pushPosition(p);
      }
      if (i > 0) {
        core.drawLine();
      }
    });
  });
}

main();
