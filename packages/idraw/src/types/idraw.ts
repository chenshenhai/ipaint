import { TypeBrushOptions } from './brush';
import { TypeData, TypeDataPosition } from './data';

export interface TypeIDraw {
  start(): void;
  drawPath(path: { positions: TypeDataPosition[] }): void;
  playPath(path: { positions: TypeDataPosition[] }): Promise<void>;
  
  loadBrush(opts: TypeBrushOptions): Promise<void>;
  setBrushSize(size: number): void;
  useBrush(name: string): void;
  getData(): TypeData;
}