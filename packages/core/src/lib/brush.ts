import { createCanvas } from './canvas';

export function updateBrushColor(
  pattern: HTMLImageElement | HTMLCanvasElement,
  color: number
  ): HTMLCanvasElement {
  const temp = createCanvas(pattern.width, pattern.height);
  const ctx2d = temp.getContext('2d');
  ctx2d?.drawImage(pattern, 0, 0);
  const imgData: ImageData | undefined = ctx2d?.getImageData(0, 0, temp.width, temp.height);
  if (imgData) {
    for (var i = 0, n = imgData.data.length / 4; i < n; i++) {
      imgData.data[(i * 4)] = (color & 0xff0000) >> 16;
      imgData.data[(i * 4) + 1] = (color & 0x00ff00) >> 8;
      imgData.data[(i * 4) + 2] = (color & 0x0000ff);
    }
    ctx2d?.putImageData(imgData, 0, 0);
  }
  return temp;
}