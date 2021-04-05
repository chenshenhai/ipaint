import { TypeBrushPoint, TypeDataPosition  } from './../base';


export abstract class TypeModuleCore {
  // public abstract name: string;
  private _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }
  public abstract pushPosition(p: TypeDataPosition): void;
  public abstract drawStart(): void;
  public abstract drawEnd(): void;
  public abstract drawLine(): void;
}