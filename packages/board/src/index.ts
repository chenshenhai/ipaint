import {
  TypeData, TypeBrushOptions, TypeDataPosition, TypeDataPath,
  // TypeWatchCallback,
} from '@idraw/types';
import util from '@idraw/util';
import Core from '@idraw/core';
import brush from '@idraw/brush';
import { Watcher } from './util/watcher';
import Container from './container';
import { parseMaskToCanvasPosition } from './util/parse';
import { DEFAULT_BG_COLOR, DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_BRUSH, DEFAULT_PRESSURE } from './util/constant';
import EventEmitter from './util/draw-event';

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

type StatusType = 'SCALE_CANVAS' | 'ALLOW_DRAWING'

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
  private _facsimileImage?: string;
  private _event: EventEmitter;

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
    this._event = new EventEmitter();
  }

  async ready() {
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

    await this.loadBrush({ name: 'ink', src: brush.ink.src});
    await this.loadBrush({ name: 'light', src: brush.light.src });

    this.useBrush(DEFAULT_BRUSH, {
      size: DEFAULT_SIZE,
      color: DEFAULT_COLOR,
      pressure: DEFAULT_PRESSURE
    });
    this._isStart = true;
  }

  async loadBrush(opts: TypeBrushOptions) {
    const image = await loadImage(opts.src);
    this._patternMap[opts.name] = image;
    this._data.brushMap[opts.name] = opts;
  }

  setBrushSize(size: number) {
    this._core.setSize(size);
  }

  useBrush(
    name: string,
    opts: { size: number, color: string, pressure: number }
  ) {
    const { size, color, pressure } = opts;
    const image = this._patternMap[name];
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

  undo() {
    this._core.clear();
    if (this._data.paths.length > 0) {
      this._data.paths.pop();
    }
    if (!this._facsimileImage) {
      this._core.setBackgroundColor(DEFAULT_BG_COLOR);
    }
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

}



