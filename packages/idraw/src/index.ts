import { TypeIDraw } from './types/index';
import { Watcher } from './watcher/index';

export default class IDraw implements TypeIDraw {

  private _canvas: HTMLCanvasElement;
  private _watcher: Watcher;
  private _isStart: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._watcher = new Watcher(canvas);
  }

  start() {
    if (this._isStart === true) {
      return;
    }
    const watcher = this._watcher;
    watcher.onDrawStart((p) => {
      console.log('onDrawStart: ', p)
    });
    watcher.onDraw((p) => {
      console.log('onDraw: ', p)
    });
    watcher.onDrawEnd((p) => {
      console.log('onDrawEnd: ', p)
    });
    this._isStart = true;
  }
}