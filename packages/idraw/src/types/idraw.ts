import { TypeBrushOptions } from './brush';
import { TypePosition } from './position';

export interface TypeIDraw {
  start(): void;
  drawPath(path: { positions: TypePosition[] }): void;
  playPath(path: { positions: TypePosition[] }): Promise<void>;
  
  loadBrush(opts: TypeBrushOptions): Promise<void>;
  // setBrushSize(size: number): Promise<void>; 
}