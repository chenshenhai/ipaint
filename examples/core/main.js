const data = window.iPaintDemoData.basic;

function createBrush() {
  const dot = document.createElement('canvas');
  dot.width = 80;
  dot.height = 80;
  const ctx = dot.getContext('2d');
  
  var gradient = ctx.createRadialGradient(40, 40, 40, 40, 40, 0);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  
  ctx.beginPath();
  ctx.arc(40, 40, 40, Math.PI * 0, Math.PI * 2, true)
  ctx.closePath();
  ctx.fill(); 
  // TODO
  // document.querySelector('body').appendChild(dot);
  return dot;
}


function draw(canvas, opts = {}) {
  const { iPaintCore } = window;
  const width = 500;
  const height = 500;
  const devicePixelRatio = opts.devicePixelRatio || 1;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.setAttribute('style', `width: ${width}; height: ${height};`)
  const context = canvas.getContext('2d');
  const core = new iPaintCore(context, { devicePixelRatio: devicePixelRatio });
  
  data.paths.forEach(async (path) => {

    core.setBrush({
      name: 'dot',
      pattern: createBrush(),
      maxSize: path.size,
      minSize: 0,
    });

    core.setColor('#007fff');
    core.setPressure(0.4);
    core.setBackgroundColor('#ffffff');
    
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

function main() {
  draw(document.querySelector('#canvas'), { devicePixelRatio: 1 })
  draw(document.querySelector('#canvas-2'), { devicePixelRatio: 2 })
}

main();
