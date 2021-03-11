export type TypeBrushPoint = {
  name: string;
  pattern: HTMLImageElement | HTMLCanvasElement,
  maxSize: number;
  minSize: number;
}

export type TypeBrushOptions = {
  name: string,
  src: string,
  size?: number;
}