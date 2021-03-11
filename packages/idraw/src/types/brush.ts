export type TypeBrushPoint = {
  pattern: HTMLImageElement | HTMLCanvasElement,
  maxSize: number;
  minSize: number;
}

export type TypeBrushOptions = {
  name: string,
  src: string,
  size?: number;
}