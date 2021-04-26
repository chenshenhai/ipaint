export type TypeBrushPoint = {
  name: string;
  pattern: HTMLImageElement | HTMLCanvasElement,
  maxSize: number;
  minSize: number;
  color: number;
  pressure: number; // 0 - 1 // 
}

export type TypeBrushOptions = {
  name: string,
  src: string,
  size?: number;
}