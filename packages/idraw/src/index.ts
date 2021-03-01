import { TypeIDraw } from './types/index';
import { Watcher } from './watcher/index';
import { Brush } from './brush/index'

export default class IDraw implements TypeIDraw {

  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D
  private _watcher: Watcher;
  private _brush: Brush;
  private _isStart: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this._watcher = new Watcher(this._canvas);
    this._brush = new Brush(this._context)
  }

  start() {
    if (this._isStart === true) {
      return;
    }
    const watcher = this._watcher;
    const brush = this._brush;
    watcher.onDrawStart((p) => {
      brush.drawStart(p)
    });
    watcher.onDraw((p) => {
      brush.pushPosition(p);
      brush.drawLine();
    });
    watcher.onDrawEnd((p) => {
      brush.pushPosition(p);
      brush.drawEnd(p);
    });
    this._isStart = true;
  }
}