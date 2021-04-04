import { TypeIDraw, TypeData, TypeBrushOptions } from '@idraw/types';
import { Watcher } from './watcher/index';
import util from '@idraw/util';
import Core from '@idraw/core';

const { loadImage } = util.loader;
const { compose,   delay, } = util.time;

export default class IDraw implements TypeIDraw {

  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D
  private _watcher: Watcher;
  private _core: Core;
  private _isStart: boolean = false;
  private _data: TypeData;
  private _patternMap: {[name: string]: HTMLImageElement | HTMLCanvasElement} = {};
  private _currentSize: number = 10;


  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this._watcher = new Watcher(this._canvas);
    this._core = new Core(this._context);
    this._data = { brushMap: {}, paths: [] };
    // this._patternMap: 
  }

  start() {
    if (this._isStart === true) {
      return;
    }
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
      core.pushPosition(p);
      core.drawEnd();
      core.drawLine();
      const positions = core.getPositions();
      const brushName = core.getBrushName();
      const size = this._currentSize;
      if (typeof brushName === 'string') {
        this._data.paths.push({ brush: brushName, size, positions, })
      }
    });
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

  async draw(data: TypeData): Promise<void> {
    const core = this._core;
    const brushTasks: Promise<any>[] = []
    Object.keys(data.brushMap).forEach((name) => {
      brushTasks.push(this.loadBrush(data.brushMap[name]))
    });

    await Promise.all(brushTasks);
    data.paths.forEach(async (path) => {
      this.useBrush(path.brush);
      this.setBrushSize(path.size);
      path.positions.forEach((p, i) => {
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
    });
  }

  async play(data: TypeData): Promise<void> {
    const core = this._core;
    const brushTasks: Promise<any>[] = []
    Object.keys(data.brushMap).forEach((name) => {
      brushTasks.push(this.loadBrush(data.brushMap[name]))
    });
    await Promise.all(brushTasks);
    const playTasks: Function[] = [];
    data.paths.forEach(async (path) => {
      const drawTasks: Function[] = [];
      drawTasks.push(async (ctx: any, next: Function) => {
        this.useBrush(path.brush);
        this.setBrushSize(path.size);
        await next();
      })
      path.positions.forEach(async (p, i) => {
        drawTasks.push(async (ctx: any, next: Function) => {
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

          let time = 1;
          if (i > 0) {
            const prevP = path.positions[i - 1];
            time = Math.max(p.t - prevP.t, 1)
          }
          await delay(time);
          await next();
        });
      });

      playTasks.push(async (ctx: any, next: Function) => {
        await compose(drawTasks)({});
        await next();
      })
    });
    await compose(playTasks)({});
  }

  
  useBrush(name: string) {
    const image = this._patternMap[name];
    this._core.setBrush({
      name,
      pattern: image,
      maxSize: this._currentSize,
      minSize: 0,
    });
  }

  getData() {
    return this._data;
  }
}



