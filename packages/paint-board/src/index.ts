import {
  TypeData, TypeBrushOptions, TypeDataPosition, TypeDataPath,
  // TypeWatchCallback,
} from '@idraw/paint-types';
import util from '@idraw/paint-util';
import Core from '@idraw/paint-core';
import { Watcher } from './util/watcher';
import Container from './container';
import { parseMaskToCanvasPosition } from './util/parse';
import { DEFAULT_BG_COLOR, DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_BRUSH, DEFAULT_PRESSURE } from './util/constant';
import { DrawEvent, TypeDrawEventArgMap } from './util/draw-event';
import { createDefaultBrushPattern } from './util/brush';

// import './css/index.less';

type Options = {
  width: number;
  height: number;
}

type PrivateOpts = {
  devicePixelRatio: number
} & Options;

const defaultOpts = {
  devicePixelRatio: 1
}

const { loadImage } = util.loader;

type StatusType = 'SCALE_CANVAS' | 'ALLOW_DRAWING' | 'NOT_ALLOW_DRAWING'

export default class Board {

  private _dom: HTMLElement;
  private _opts: PrivateOpts;
  private _container: Container;

  private _mask: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D
  private _watcher: Watcher;
  private _core: Core;
  private _isStart: boolean = false;
  private _data: TypeData;
  private _patternMap: {[name: string]: HTMLImageElement | HTMLCanvasElement} = {};
  private _status: StatusType = 'ALLOW_DRAWING';
  private _prevPosition?: TypeDataPosition;
  private _event: DrawEvent;

  constructor(dom: HTMLElement, opts: Options) {
    this._opts = { ...defaultOpts, ...opts }
    this._dom = dom;
    this._container = new Container(this._dom, {
      ...this._opts,
    });
    this._mask = this._container.getMask();
    this._canvas = this._container.getCanvas();
    this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    this._watcher = new Watcher(this._mask);
    this._core = new Core(this._context, { devicePixelRatio: this._opts.devicePixelRatio });
    this._core.setBackgroundColor(DEFAULT_BG_COLOR);
    this._data = { brushMap: {}, paths: [] };
    this._event = new DrawEvent();
    this.addBrushPattern(DEFAULT_BRUSH, createDefaultBrushPattern());
  }

  async start() {
    if (this._isStart === true) {
      return;
    }
    this._container.render();
    const watcher = this._watcher;
    const core = this._core;
    watcher.onDrawStart((p) => {
      if (this._status === 'ALLOW_DRAWING') {
        core.drawStart()
      } else if (this._status === 'SCALE_CANVAS') {
        if (!this._prevPosition) {
          this._prevPosition = p
        }
      }
      this._event.trigger('drawStart', p);
    });
    watcher.onDraw((p) => {
      if (this._status === 'ALLOW_DRAWING') {
        const _p = parseMaskToCanvasPosition(p, this._mask, this._canvas);
        core.pushPosition(_p);
        core.drawLine();
      }
      this._event.trigger('draw', p);
    });
    watcher.onDrawEnd((p) => {
      if (this._status === 'ALLOW_DRAWING') {
        core.drawEnd();
        core.drawLine();
        const positions = core.getPositions();
        const brushName = core.getBrushName();
        const pressure = core.getPressure();
        const color = this._core.getColor();
        const size = this._core.getSize();
        if (typeof brushName === 'string') {
          this._data.paths.push({ brush: brushName, size, positions, pressure, color})
        }
      }
      this._prevPosition = undefined;
      this._event.trigger('drawEnd', p);
    });
    this.useBrush(DEFAULT_BRUSH, {
      size: DEFAULT_SIZE,
      color: DEFAULT_COLOR,
      pressure: DEFAULT_PRESSURE
    });
    this._isStart = true;
  }

  on<T extends keyof TypeDrawEventArgMap >(eventKey: T, callback: (p: TypeDrawEventArgMap[T]) => any) {
    if (this._event.has(eventKey) === false) {
      this._event.on(eventKey, callback);
    }
  }

  async loadBrush(opts: TypeBrushOptions) {
    const image = await loadImage(opts.src);
    this._patternMap[opts.name] = image;
    this._data.brushMap[opts.name] = opts;
  }

  setBrushSize(size: number) {
    this._core.setSize(size);
  }

  addBrushPattern(name: string, pattern: HTMLImageElement | HTMLCanvasElement) {
    this._patternMap[name] = pattern;
  }

  useBrush(
    name: string,
    opts: { size: number, color: string, pressure: number }
  ) {
    const { size, color, pressure } = opts;
    const image = this._patternMap[name] || this._patternMap[DEFAULT_BRUSH];

    this._core.setBrush({
      name,
      pattern: image,
      maxSize: size,
      minSize: 0,
      color,
      pressure
    });
  }

  getData() {
    return this._data;
  }

  setData(data: TypeData) {
    this._data = data;
  }

  async prepare() {
    const brushMap = this._data.brushMap;
    const names = Object.keys(brushMap);
    const promises: Promise<HTMLImageElement>[] = [];
    names.forEach((name) => {
      promises.push(loadImage(brushMap[name].src));
    });
    
    return new Promise((resolve, reject) => {
      Promise.all(promises).then((imgs) => {
        names.forEach((name, idx) => {
          this._patternMap[name] = imgs[idx];
        });
        resolve(true);
      }).then((err) => {
        reject(err);
      })
    });

  }

  undo() {
    this._core.clear();
    if (this._data.paths.length > 0) {
      this._data.paths.pop();
    }
    this._core.setBackgroundColor(DEFAULT_BG_COLOR);
    this.redraw();
  }

  redraw() {
    const core = this._core;
    // core.setBackgroundColor(DEFAULT_BG_COLOR);
    this._data.paths.forEach((path: TypeDataPath) => {
      this.useBrush(path.brush, {
        size: path.size || DEFAULT_SIZE,
        color: path.color || DEFAULT_COLOR,
        pressure: path.pressure || DEFAULT_PRESSURE,
      });
      path.positions.forEach(async (p, i) => {
        if (i === 0) {
          core.drawStart();
        } else if (i === path.positions.length - 1) {
          core.pushPosition(p);
          core.drawEnd();
        } else {
          core.pushPosition(p);
        }
        if (i > 0) {
          core.drawLine();
        }
      });
    })
  }

  allowDraw(status: boolean) {
    if (status === true) {
      this._status = 'ALLOW_DRAWING'
    } else {
      this._status = 'NOT_ALLOW_DRAWING'
    }
  }

}



