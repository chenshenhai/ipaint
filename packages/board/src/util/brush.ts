import { TypeBrushPoint } from '@ipaint/types';
import { DEFAULT_COLOR, DEFAULT_PRESSURE, DEFAULT_SIZE, DEFAULT_BRUSH } from './constant'; 

export function createDefaultBrushPattern(): HTMLCanvasElement {
  const brush = document.createElement('canvas');
  brush.width = 80;
  brush.height = 80;
  const ctx = brush.getContext('2d') as CanvasRenderingContext2D;

  // const gradient = ctx.createRadialGradient(40, 40, 40, 40, 40, 0);
  // gradient.addColorStop(0, "transparent");
  // gradient.addColorStop(1, "#000000");
  // ctx.fillStyle = gradient;

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(40, 40, 40, Math.PI * 0, Math.PI * 2, true)
  ctx.closePath();
  ctx.fill();
  return brush;
}

export function createDefaultBrush(): TypeBrushPoint {
  return {
    name: DEFAULT_BRUSH,
    pattern: createDefaultBrushPattern(),
    maxSize: DEFAULT_SIZE,
    minSize: 0,
    color: DEFAULT_COLOR,
    pressure: DEFAULT_PRESSURE
  }
}
