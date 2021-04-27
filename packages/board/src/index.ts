import { TypeData, TypeBrushOptions } from '@idraw/types';
import util from '@idraw/util';
import Core from '@idraw/core';
import brush from '@idraw/brush';
import { Watcher } from './util/watcher';
import Container from './container';
import { eventCode, eventHub } from './service/event';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}

const { loadImage } = util.loader;
const { downloadImageFromCanvas } = util.file;
// const { compose,   delay, } = util.time;

export default class Board {

  private _dom: HTMLElement;
  private _container: Container;

  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D
  private _watcher: Watcher;
  private _core: Core;
  private _isStart: boolean = false;
  private _data: TypeData;
  private _patternMap: {[name: string]: HTMLImageElement | HTMLCanvasElement} = {};
  private _currentSize: number = 10;


  constructor(dom: HTMLElement, opts: Options) {

    this._dom = dom;
    this._container = new Container(this._dom, opts);
    this._canvas = this._container.getCanvas();
    this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    this._watcher = new Watcher(this._canvas);
    this._core = new Core(this._context);
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
      core.drawStart()
    });
    watcher.onDraw((p) => {
      core.pushPosition(p);
      core.drawLine();
    });
    watcher.onDrawEnd((p) => {
      // core.pushPosition(p);
      core.drawEnd();
      core.drawLine();
      const positions = core.getPositions();
      const brushName = core.getBrushName();
      const size = this._currentSize;
      if (typeof brushName === 'string') {
        this._data.paths.push({ brush: brushName, size, positions, })
      }
    });

    await this.loadBrush({ name: 'ink', src: brush.ink.src});
    this.useBrush('ink', { size: 20, color: 0x000000, pressure: 0.3 });
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

  private _initEvent() {
    eventHub.on(eventCode.BOARD_CLEAR, () => {
      this._core.clear();
      this._data.paths = [];
    });
    eventHub.on(eventCode.LOG_DATA, () => {
      console.log('data = ', this.getData());
    });
    eventHub.on(eventCode.DOWNLOAD, () => {
      downloadImageFromCanvas(
        this._canvas, 
        {
          filename: 'idraw.png', 
          type: 'image/png' 
        }
      );
    })
  }
}



