import {
  TypeWatcher,
  TypeWatchCallback,
  TypeDataPosition,
} from '@idraw/paint-types';
// import util from '@idraw/paint-util';
// const { throttle } = util.time;


type Options = {
  touch: HTMLDivElement;
  canvas: HTMLCanvasElement;
}

export class Watcher implements TypeWatcher {

  private _touch: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _isPainting: boolean = false;
  private _onDraw?: TypeWatchCallback;
  private _onDrawStart?: TypeWatchCallback;
  private _onDrawEnd?: TypeWatchCallback;

  constructor(opts: Options) {
    this._touch = opts.touch;
    this._canvas = opts.canvas;
    this._isPainting = false;
    this._initEvent();
  }

  onDraw(callback: TypeWatchCallback) {
    // this._onDraw = throttle(callback, 8);
    this._onDraw = callback;
  }

  onDrawEnd(callback: TypeWatchCallback) {
    this._onDrawEnd = callback;
  }

  onDrawStart(callback: TypeWatchCallback) {
    this._onDrawStart = callback;
  }

  _initEvent() {
    const touch = this._touch;
    touch.addEventListener('mousedown', this._onStart.bind(this));
    touch.addEventListener('mousemove', this._onMove.bind(this));
    touch.addEventListener('mouseup', this._onEnd.bind(this));

    touch.addEventListener('touchstart', this._onStart.bind(this));
    touch.addEventListener('touchmove', this._onMove.bind(this));
    touch.addEventListener('touchend', this._onEnd.bind(this));

    const mouseupEvent = new MouseEvent('mouseup');
    document.querySelector('body')?.addEventListener('mousemove', (e) => {
      // @ts-ignore
      if (e && e.path && e.path[0] !== touch) {
        if (this._isPainting === true) {
          touch.dispatchEvent(mouseupEvent);
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

    const rect = canvas.getBoundingClientRect();
    const p = {
      x: x - rect.left,
      y: y - rect.top,
      t: Date.now(),
    };
    return p;
  }

  private _isVaildPosition(p: TypeDataPosition) {
    return ( !isNaN(p.x) && !isNaN(p.y) && p.t > 0)
  }
  
}
