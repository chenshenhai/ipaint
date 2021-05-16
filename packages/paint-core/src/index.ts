import { TypeBrushPoint, TypeDataPosition } from '@idraw/paint-types';
import util from '@idraw/paint-util';
import { updateBrushColor } from './lib/brush';

const DEFAULT_COLOR = '#000000';
const DEFAULT_PRESSURE = 0.4;
const DEFAULT_SIZE = 20;

const { toColorHexNum } = util.color;

type TypeCoreOpts = {
  devicePixelRatio?: number 
}

type TypePrivateCoreOpts = {
  devicePixelRatio: number
} & TypeCoreOpts;

const defaultOpts = {
  devicePixelRatio: 1
}

export default class Core {

  private _ctx: CanvasRenderingContext2D;
  private _brushPoint: TypeBrushPoint|null = null;
  private _inertanceNum: number;
  private _positions: TypeDataPosition[];
  private _prevPosition: TypeDataPosition|null;
  private _prevBrushSize: number = 0;
  private _opts: TypePrivateCoreOpts = defaultOpts;
  
  constructor(ctx: CanvasRenderingContext2D, opts?: TypeCoreOpts) {
    if (opts) {
      this._opts = { ...defaultOpts, ...opts, };
    }
    this._ctx = ctx;
    this._inertanceNum = 10;
    this._positions = [];
    this._prevPosition = null;
  }

  public clear() {
    this._positions = [];
    const { width, height } = this._ctx.canvas;
    this._ctx.clearRect(0, 0, width, height);
  }

  public setBackgroundColor(color: string) {
    const { width, height } = this._ctx.canvas;
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, width, height);
  }

  public setBrush(brush: TypeBrushPoint) {
    this._brushPoint = {...{ color: DEFAULT_COLOR }, ...brush};
    this.setColor(this._brushPoint.color);
  }

  public setSize(size: number) {
    if (this._brushPoint) {
      this._brushPoint.maxSize = size;
      this._brushPoint.minSize = 0;
    }
  }

  public setColor(color: string) {
    if (this._brushPoint) {
      this._brushPoint.color = color;
      const pattern = updateBrushColor(this._brushPoint.pattern, toColorHexNum(color));
      this._brushPoint.pattern = pattern;
    }
  }

  public setPressure(pressure: number) {
    if (this._brushPoint) {
      this._brushPoint.pressure = pressure;
    }
  }

  public getSize(): number {
    return this._brushPoint?.maxSize || DEFAULT_SIZE;
  }

  public getColor(): string {
    return this._brushPoint?.color || DEFAULT_COLOR;
  }

  public getPressure(): number {
    return this._brushPoint?.pressure || DEFAULT_PRESSURE;
  }

  public getBrushName(): string|undefined {
    return this._brushPoint?.name;
  }

  public getPositions() {
    return [...[], ...this._positions];
  }

  public pushPosition(p: TypeDataPosition) {
    if (this._isVaildPosition(p)) {
      this._positions.push(p);
    }
  }

  public drawStart() {
    this._positions = [];
    this._prevPosition = null;
    this._prevBrushSize = 0;
  }

  public drawEnd() {
    // TODO
  }

  public drawLine() {
    if (!this._brushPoint) {
      return;
    }
    const ctx = this._ctx;
    const pos = this._getBufferedCurrentPosition();
    if (pos == null) return;

    if (this._prevPosition == null) {
      this._prevPosition = pos;
    }
    
    let t = (pos.t - this._prevPosition.t);
    const distance = this._getDistance(pos, this._prevPosition);
    const velocity = distance / Math.max(1, t);
    const curve = function(velocity: number, size: number, sizeNegative: number, pressureRatio: number) {
      return sizeNegative * velocity / pressureRatio + size;
    }

    let pressureRatio = this._brushPoint.pressure * 20;
    pressureRatio = Math.min(Math.max(pressureRatio, 1), 20);
    let brushSize = Math.max(
      this._resetDeviceSize(this._brushPoint.minSize),
      curve(
        velocity,
        this._resetDeviceSize(this._brushPoint.maxSize),
        (0 - this._resetDeviceSize(this._brushPoint.maxSize)) - this._resetDeviceSize(this._brushPoint.minSize),
        pressureRatio,
      )
    );
    
    
    ctx.save();
    this._drawPath(ctx, this._prevPosition, pos, brushSize, distance);
    ctx.restore();

    this._prevPosition = pos;
    this._prevBrushSize = brushSize;
  }


  private _getDistance(start: TypeDataPosition, end: TypeDataPosition) {
    let distance = ((start.x - end.x) * (start.x - end.x)) + ((start.y - end.y) * (start.y - end.y));
    return (distance === 0) ? distance : Math.sqrt(distance);
  }

  private _drawPath(ctx: CanvasRenderingContext2D, startPos: TypeDataPosition, endPos: TypeDataPosition, brushSize: number, distance: number) {
    if (!this._brushPoint) {
      return;
    }
    let t = 0;
    let brushDelta = brushSize - (this._prevBrushSize || 0);
  
    while (t < 1) {
      let brushSizeCur = (Math.min((this._prevBrushSize || 0) + (brushDelta * t), this._resetDeviceSize(this._brushPoint.maxSize)));
      let pos = this._getInterlatePos(startPos, endPos, t);
      let px = this._resetDeviceSize(pos.x);
      let py = this._resetDeviceSize(pos.y);
      ctx.drawImage(this._brushPoint.pattern, px, py, brushSizeCur, brushSizeCur);
      t += 1 / distance;
    }
  }

  private _getInterlatePos(start: TypeDataPosition, end: TypeDataPosition, moveLen: number) {
    let x = start.x + (end.x - start.x) * moveLen;
    let y = start.y + (end.y - start.y) * moveLen;
    return { x: x, y: y, t: 0, };
  }

  private _getBufferedCurrentPosition() {
    let pos = { x: 0, y: 0, t: 0};
    let inertanceNum = Math.min(this._inertanceNum, this._positions.length);
  
    if (inertanceNum == 0) {
      return null
    }
  
    for (let i = 1; i < inertanceNum + 1; i++) {
      let p = this._positions[this._positions.length - i];
      pos.x += p.x;
      pos.y += p.y;
      pos.t += p.t;
    }
  
    pos.x /= inertanceNum;
    pos.y /= inertanceNum;
    pos.t /= inertanceNum;
  
    return pos;
  }

  private _isVaildPosition(p: TypeDataPosition) {
    return ( p.x > 0 && p.y > 0 && p.t > 0)
  }

  private _resetDeviceSize(num: number): number {
    return num * this._opts.devicePixelRatio
  }
}