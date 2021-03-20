import { TypeBrushOptions } from './brush';
import { TypeData, TypeDataPosition } from './data';

export interface TypeIDraw {
  start(): void;
  draw(data: TypeData): Promise<void>
  play(data: TypeData): Promise<void>
  
  loadBrush(opts: TypeBrushOptions): Promise<void>;
  setBrushSize(size: number): void;
  useBrush(name: string): void;
  getData(): TypeData;
}