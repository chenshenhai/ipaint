import {
  TypeWatcher,
  TypeWatchCallback,
  TypeDataPosition,
} from '@idraw/types';

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

    canvas.addEventListener('touchstart', this._onStart.bind(this));
    canvas.addEventListener('touchmove', this._onMove.bind(this));
    canvas.addEventListener('touchend', this._onEnd.bind(this));

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

  _onStart(e: MouseEvent|TouchEvent) {
    e.preventDefault();
    this._isPainting = true;
    if (typeof this._onDrawStart === 'function') {
      const p = this._getPosition(e);
      if (this._isVaildPosition(p)) {
        this._onDrawStart(p);
      }
    }
  }
  
  _onMove(e: MouseEvent|TouchEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (this._isPainting === true) {
      if (typeof this._onDraw === 'function') {
        const p = this._getPosition(e);
        if (this._isVaildPosition(p)) {
          this._onDraw(p);
        }
      }
    }
  }
  
  _onEnd(e: MouseEvent|TouchEvent) {
    e.preventDefault();
    this._isPainting = false;
    if (typeof this._onDrawEnd === 'function') {
      const p = this._getPosition(e);
      if (this._isVaildPosition(p)) {
        this._onDrawEnd(p);
      }
    }
  }

  _getPosition(e: MouseEvent|TouchEvent) {
    const canvas = this._canvas;
    let x = 0;
    let y = 0;

    if (e instanceof TouchEvent) {
      const touch: Touch = e.touches[0];
      if (touch) {
        x = touch.clientX;
        y = touch.clientY;
      }
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const p = {
      x: x - canvas.getBoundingClientRect().left,
      y: y - canvas.getBoundingClientRect().top,
      t: Date.now(),
    };
    return p;
  }

  private _isVaildPosition(p: TypeDataPosition) {
    return ( p.x > 0 && p.y > 0 && p.t > 0)
  }
  
}
