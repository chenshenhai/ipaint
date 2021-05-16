
// export function createCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
//   if (window.OffscreenCanvas) {
//     return new window.OffscreenCanvas(width, height);
//   } else {
//     const canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     return canvas;
//   }
// }

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}