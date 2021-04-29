import { TypeData, TypeBrushOptions, TypeDataPosition, TypeDataPath } from '@idraw/types';
import util from '@idraw/util';
import Core from '@idraw/core';
import brush from '@idraw/brush';
import { Watcher } from './util/watcher';
import Container from './container';
import { eventCode, eventHub } from './service/event';
import { parseMaskToCanvasPosition } from './service/parse';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}

const { loadImage } = util.loader;
const { downloadImageFromCanvas } = util.file;
// const { compose,   delay, } = util.time;

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
  private _currentSize: number = 20;
  private _currentPressure: number = 0.3;
  private _currentColor: number = 0x000000;
  private _status: StatusType = 'ALLOW_DRAWING';
  private _prevPosition?: TypeDataPosition;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._container = new Container(this._dom, opts);
    this._mask = this._container.getMask();
    this._canvas = this._container.getCanvas();
    this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    this._watcher = new Watcher(this._mask);
    this._core = new Core(this._context);
    this._core.setBackgroundColor(0xffffff);
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
        const pressure = this._currentPressure;
        const color = this._currentColor;
        const size = this._currentSize;
        if (typeof brushName === 'string') {
          this._data.paths.push({ brush: brushName, size, positions, pressure, color})
        }
      }
      this._prevPosition = undefined;
    });

    await this.loadBrush({ name: 'ink', src: brush.ink.src});
    this.useBrush('ink', { size: this._currentSize, color: this._currentColor, pressure: this._currentPressure });
    this._initEvent();
    this._isStart = true;
  }

  async loadBrush(opts: TypeBrushOptions) {
    const image = await loadImage(opts.src);
    this._patternMap[opts.name] = image;
    this._data.brushMap[opts.name] = opts;
  }

  setBrushSize(size: number) {
    this._currentSize = size;
    this._core.setSize(this._currentSize);
  }

  useBrush(
    name: string,
    opts: { size: number, color: number, pressure: number }
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
    if (this._data.paths.length > 0) {
      this._data.paths.pop();
    }
    this.redraw();
  }

  redraw() {
    const core = this._core;
    // TODO
    core.setBackgroundColor(0xffffff);
    this._data.paths.forEach((path: TypeDataPath) => {
      this.useBrush(path.brush, {
        size: path.size || 20, // TODO
        color: path.color || 0x000000, // TODO
        pressure: path.pressure || 0.3, // TODO
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

  private _initEvent() {

    eventHub.on(eventCode.BOARD_CLEAR, () => {
      this._core.clear();
      this._core.setBackgroundColor(0xffffff); // TODO
      this._data.paths = [];
    });
    eventHub.on(eventCode.LOG_DATA, () => {
      console.log('data = ', this.getData());
    });
    eventHub.on(eventCode.DOWNLOAD, () => {
      downloadImageFromCanvas(this._canvas, {filename: 'idraw.png', type: 'image/png'});
    });
    eventHub.on(eventCode.SCALE_CANVAS, () => {
      if (this._status !== 'SCALE_CANVAS') {
        this._status = 'SCALE_CANVAS';
        this._container.showScaleProgress(true);
      } else {
        this._status = 'ALLOW_DRAWING';
        this._container.showScaleProgress(false);
      }
    });
    eventHub.on(eventCode.SHOW_COLOR_SELECTOR, () => {
      this._container.showActionColor();
    });
    eventHub.on(eventCode.UNDO, () => {
      this.undo();
    })
  }
}



