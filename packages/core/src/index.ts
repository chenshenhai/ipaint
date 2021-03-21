export class Core {

  private _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }

  drawStart() {
    console.log(this._ctx);
  }
}