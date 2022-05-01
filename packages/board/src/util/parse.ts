// import { TypeDataPosition } from '@ipaint/types';
// import { getDomTransform } from './style';

// export function parseMaskToCanvasPosition(
//   p: TypeDataPosition, 
//   mask: HTMLDivElement, 
//   canvas: HTMLCanvasElement ): TypeDataPosition {
//   const transform = getDomTransform(canvas);
//   // const rect = canvas.getBoundingClientRect();
//   p.x = (p.x - transform.translateX) / (transform.scaleX || 1);
//   p.y = (p.y - transform.translateY) / (transform.scaleY || 1);
//   return p;
// }