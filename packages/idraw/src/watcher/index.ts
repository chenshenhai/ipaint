import {
  TypeWatcher,
  TypeWatchCallback,
  TypePosition,
} from './../types/index';

export class Watcher implements TypeWatcher {

  private _canvas: HTMLCanvasElement;
  private _isPainting: boolean = false;
  private _onDraw?: TypeWatchCallback;
  private _onDrawStart?: TypeWatchCallback;
  private _onDrawEnd?: TypeWatchCallback;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._isPainting = false;
    this._initEvent();
  }

  onDraw(callback: TypeWatchCallback) {
    this._onDraw = callback;
  }

  onDrawEnd(callback: TypeWatchCallback) {
    this._onDrawEnd = callback;
  }

  onDrawStart(callback: TypeWatchCallback) {
    this._onDrawStart = callback;
  }

  _initEvent() {
    const canvas = this._canvas;
    canvas.addEventListener('mousedown', this._onStart.bind(this));
    canvas.addEventListener('mousemove', this._onMove.bind(this));
    canvas.addEventListener('mouseup', this._onEnd.bind(this));

    const mouseupEvent = new MouseEvent('mouseup');
    document.querySelector('body')?.addEventListener('mousemove', (e) => {
      // @ts-ignore
      if (e && e.path && e.path[0] !== canvas) {
        if (this._isPainting === true) {
          canvas.dispatchEvent(mouseupEvent);
        }
      }
    }, false)
  }

  _onStart(e: MouseEvent) {
    this._isPainting = true;
    if (typeof this._onDrawStart === 'function') {
      const p = this._getPosition(e);
      this._onDrawStart(p);
    }
  }
  
  _onMove(e: MouseEvent) {
    if (this._isPainting === true) {
      if (typeof this._onDraw === 'function') { 
        const p = this._getPosition(e);
        this._onDraw(p);
      }
    }
  }
  
  _onEnd(e: MouseEvent) {
    this._isPainting = false;
    if (typeof this._onDrawEnd === 'function') {
      const p = this._getPosition(e);
      this._onDrawEnd(p);
    }
  }

  _getPosition(e: MouseEvent) {
    const canvas = this._canvas;
    const x = e.clientX;
    const y = e.clientY;
    const p = {
      x: x - canvas.getBoundingClientRect().left,
      y: y - canvas.getBoundingClientRect().top,
      t: Date.now(),
    };
    return p;
  }
  
}
