export function createGradientBrushPattern(): HTMLCanvasElement {
  const brush = document.createElement('canvas');
  brush.width = 80;
  brush.height = 80;
  const ctx = brush.getContext('2d') as CanvasRenderingContext2D;
  const gradient = ctx.createRadialGradient(40, 40, 40, 40, 40, 0);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(40, 40, 40, Math.PI * 0, Math.PI * 2, true)
  ctx.closePath();
  ctx.fill();
  return brush;
}

export function createCircleBrushPattern(): HTMLCanvasElement {
  const brush = document.createElement('canvas');
  brush.width = 80;
  brush.height = 80;
  const ctx = brush.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(40, 40, 40, Math.PI * 0, Math.PI * 2, true)
  ctx.closePath();
  ctx.fill();
  return brush;
}


