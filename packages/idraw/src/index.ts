import { TypeData, TypeBrushOptions, TypeDataPosition, TypeDataPath } from '@idraw/types';
import util from '@idraw/util';
import Core from '@idraw/core';
import brush from '@idraw/brush';
import { Watcher } from './util/watcher';
import Container from './container';
import { eventCode, eventHub } from './service/event';
import { parseMaskToCanvasPosition } from './service/parse';
import { DEFAULT_BG_COLOR, DEFAULT_COLOR, DEFAULT_SIZE, DEFAULT_BRUSH, DEFAULT_PRESSURE } from './util/constant';

import './css/index.less';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}

const { loadImage } = util.loader;
const { downloadImageFromCanvas } = util.file;
// const { toColorHexNum  } = util.color;
// const { compose, delay, } = util.time;

type StatusType = 'SCALE_CANVAS' | 'ALLOW_DRAWING'

export default class Board {

  private _dom: HTMLElement;
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

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._container = new Container(this._dom, {
      ...opts,
      ...{
        onChangeColor: (color: string) => {
          eventHub.trigger(eventCode.SET_COLOR, color);
          eventHub.trigger(eventCode.SHOW_COLOR_SELECTOR, false);
        },
        onChangeSize: (size: number) => {
          eventHub.trigger(eventCode.SET_SIZE, size);
          eventHub.trigger(eventCode.SHOW_SIZER, false);
        },
        onChangeBrush: (name: string) => {
          eventHub.trigger(eventCode.SET_BRUSH, name);
          eventHub.trigger(eventCode.SHOW_BRUSH_SELECTOR, false);
        },
        onChangePressure: (pressure: number) => {
          eventHub.trigger(eventCode.SHOW_PRESSURE, false);
          eventHub.trigger(eventCode.SET_PRESSURE, pressure);
        }
      }
    });
    this._mask = this._container.getMask();
    this._canvas = this._container.getCanvas();
    this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    this._watcher = new Watcher(this._mask);
    this._core = new Core(this._context);
    this._core.setBackgroundColor(DEFAULT_BG_COLOR);
    this._data = { brushMap: {}, paths: [] };
    // this._patternMap: 
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
      
    });
    watcher.onDraw((p) => {
      if (this._status === 'ALLOW_DRAWING') {
        const _p = parseMaskToCanvasPosition(p, this._mask, this._canvas);
        core.pushPosition(_p);
        core.drawLine();
      } else if (this._status === 'SCALE_CANVAS') {
        const prevP = this._prevPosition;
        if (prevP) {
          const moveX = p.x - prevP.x;
          const moveY = p.y - prevP.y;
          this._container.moveCanvas(moveX, moveY);
        }
        this._prevPosition = p;
      }
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
    });

    await this.loadBrush({ name: 'ink', src: brush.ink.src});
    await this.loadBrush({ name: 'light', src: brush.light.src });

    this.useBrush(DEFAULT_BRUSH, {
      size: DEFAULT_SIZE,
      color: DEFAULT_COLOR,
      pressure: DEFAULT_PRESSURE
    });
    this._initEvent();
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

  setFacsimileImage(src: string) {
    this._core.clear();
    this._container.setCanvasBackgroundImage(src);
    this.redraw();
    this._facsimileImage = src;
  }

  private _initEvent() {

    eventHub.on(eventCode.BOARD_CLEAR, () => {
      this._core.clear();
      this._core.setBackgroundColor(DEFAULT_BG_COLOR);
      this._data.paths = [];
    });
    eventHub.on(eventCode.LOG_DATA, () => {
      console.log('data = ', this.getData());
    });
    eventHub.on(eventCode.DOWNLOAD, () => {
      downloadImageFromCanvas(this._canvas, {filename: 'idraw.png', type: 'image/png'});
    });
    eventHub.on(eventCode.SCALE_CANVAS, (canScale?: boolean) => {
      console.log('canScale =', canScale);
      if (typeof canScale === 'boolean') {
        if (canScale === true) {
          this._status = 'SCALE_CANVAS';
          this._container.showScaleProgress(true);
        } else {
          this._status = 'ALLOW_DRAWING';
          this._container.showScaleProgress(false);
        }
      } else if (this._status !== 'SCALE_CANVAS') {
        this._status = 'SCALE_CANVAS';
        this._container.showScaleProgress(true);
      } else {
        this._status = 'ALLOW_DRAWING';
        this._container.showScaleProgress(false);
      }
    });
    eventHub.on(eventCode.SHOW_COLOR_SELECTOR, (isShow: boolean = true) => {
      this._container.showActionColor(isShow);
    });
    eventHub.on(eventCode.SHOW_SIZER, (isShow: boolean = true) => {
      this._container.showActionSize(isShow);
    });
    eventHub.on(eventCode.SHOW_BRUSH_SELECTOR, (isShow: boolean = true) => {
      this._container.showActionBrush(isShow);
    });
    eventHub.on(eventCode.SHOW_PRESSURE, (isShow: boolean = true) => {
      this._container.showActionPressure(isShow);
    });
    eventHub.on(eventCode.UNDO, () => {
      this.undo();
    });
    eventHub.on(eventCode.CLEAR_ACTION, () => {
      eventHub.trigger(eventCode.SHOW_COLOR_SELECTOR, false);
    });
    eventHub.on(eventCode.SET_COLOR, (color: string) => {
      this._core.setColor(color);
    });
    eventHub.on(eventCode.SET_SIZE, (size: number) => {
      this._core.setSize(size);
    });
    eventHub.on(eventCode.SET_BRUSH, (brushName: string) => {
      this.useBrush(brushName, {
        color: this._core.getColor(),
        size: this._core.getSize(),
        pressure: this._core.getPressure(),
      })
    });
    eventHub.on(eventCode.SET_PRESSURE, (pressure: number) => {
      this._core.setPressure(pressure);
    })
  }
}



