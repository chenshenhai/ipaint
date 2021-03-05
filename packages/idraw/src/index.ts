import { TypeIDraw, TypePosition, TypeBrushOptions } from './types/index';
import { Watcher } from './watcher/index';
import { Brush } from './brush/index';
import { loadImage } from './util/loader';
import { compose, delay } from './util/task';

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
      brush.drawStart()
    });
    watcher.onDraw((p) => {
      brush.pushPosition(p);
      brush.drawLine();
    });
    watcher.onDrawEnd((p) => {
      brush.pushPosition(p);
      brush.drawEnd();
      brush.drawLine();
    });
    this._isStart = true;
  }

  async loadBrush(opts: TypeBrushOptions) {
    const image = await loadImage(opts.src);
    this._brush.setBrushPoint({
      pattern: image,
      maxSize: opts.size,
      minSize: 0,
    })
  }

  setBrushSize(size: number) {
    this._brush.setSize(size);
  }

  drawPath(path: { positions: TypePosition[] }) {
    const brush = this._brush;
    path.positions.forEach((p, i) => {
      let time = 0;
      if (i > 0) {
        const prev = path.positions[i - 1];
        time = p.t - prev.t;
      }

      if (i === 0) {
        brush.drawStart();
      } else if (i === path.positions.length - 1) {
        brush.pushPosition(p);
        brush.drawEnd();
      } else {
        brush.pushPosition(p);
      }
      if (i > 0) {
        brush.drawLine();
      }
    });
  }

  async playPath(path: { positions: TypePosition[] }) {
    const brush = this._brush;
    const middlewares: Function[] = [];
    path.positions.forEach((p, i) => {
      middlewares.push(async (ctx: any, next: Function) => {
        let time = 0;
        if (i > 0) {
          const prev = path.positions[i - 1];
          time = p.t - prev.t;
        }
        await delay(time);

        if (i === 0) {
          brush.drawStart();
        } else if (i === path.positions.length - 1) {
          brush.pushPosition(p);
          brush.drawEnd();
        } else {
          brush.pushPosition(p);
        }
        if (i > 0) {
          brush.drawLine();
        }
        await next();
      })
    });
    try {
      await compose(middlewares)({});
    } catch (err) {
      console.log(err);
    }
  }
}



