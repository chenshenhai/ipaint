import { TypeDataPosition } from '@idraw/types';

export function parseMaskToCanvasPosition(
  p: TypeDataPosition, 
  mask: HTMLDivElement, 
  canvas: HTMLCanvasElement ): TypeDataPosition {
  // const style = getComputedStyle(canvas);
  // const reg = /^matrix\(([0-9\.]{1,}.?)\,/i;
  // const result = reg.exec(style.transform);
  // let scale = 1;
  // if (result && result[1] && parseFloat(result[1]) > 0) {
  //   scale = parseFloat(result[1]);
  // }
  // console.log('scale ====', scale, style.width, style.height);
  // console.log('canvas.getBoundingClientRect = ', canvas.getBoundingClientRect())
  const rect = canvas.getBoundingClientRect();
  p.x = p.x - rect.x;
  p.y = p.y - rect.y;
  return p;
}