import { TypeIDraw, TypePosition } from './types/index';
import { Watcher } from './watcher/index';
// @ts-ignore
import { Brush } from './brush/index.js'

export default class IDraw implements TypeIDraw {

  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D
  private _watcher: Watcher;
  // @ts-ignore
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

  drawPath(path: { positions: TypePosition[] }) {
    // const brush = this._brush;
    // path.positions.forEach(async (p, i) => {
    //   let time = 0;
    //   if (i > 0) {
    //     const prev = path.positions[i - 1];
    //     time = p.t - prev.t;
    //   }

    //   if (i === 0) {
    //     brush.drawStart(p);
    //   } else if (i === path.positions.length - 1) {
    //     brush.pushPosition(p);
    //     brush.drawEnd(p);
    //   } else {
    //     brush.pushPosition(p);
    //   }

    //   if (i > 0 && time > 0) {
    //     brush.drawLine();
    //     await delay(time);
    //   }

    // });
   
  }
}

// function delay(time: number) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve
//     }, time);
//   })
// }