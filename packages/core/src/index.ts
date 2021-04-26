import { TypeBrushPoint, TypeDataPosition } from '@idraw/types';
import { updateBrushColor } from './lib/brush';

const DEFAULT_COLOR = 0x000000;
const DEFAULT_PRESSURE = 0.4;

export default class Core {

  private _ctx: CanvasRenderingContext2D;
  private _brushPoint: TypeBrushPoint|null = null;
  private _inertanceNum: number;
  private _positions: TypeDataPosition[];
  private _prevPosition: TypeDataPosition|null;
  private _prevBrushSize: number = 0;
  // private _expectedNextPosition: TypeDataPosition|null;
  private _acceleration: number;
  private _prevVelocity: number;
  // private _prevDistance: number;
  
  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;

    this._inertanceNum = 10;
    this._positions = [];
    this._prevPosition = null;
    // this._expectedNextPosition = null;
    this._acceleration = 0;
    this._prevVelocity = 0;
    // this._prevDistance = 0;
  }

  public clear() {
    this._positions = [];
    const { width, height } = this._ctx.canvas;
    this._ctx.clearRect(0, 0, width, height);
  }

  public setBrush(brush: TypeBrushPoint) {
    this._brushPoint = {...{ color: DEFAULT_COLOR }, ...brush};
  }

  public setSize(size: number) {
    if (this._brushPoint) {
      this._brushPoint.maxSize = size;
      this._brushPoint.minSize = 0;
    }
  }

  public setColor(color: number) {
    if (this._brushPoint) {
      this._brushPoint.color = color;
      const pattern = updateBrushColor(this._brushPoint.pattern, color);
      this._brushPoint.pattern = pattern;
    }
  }

  public setPressure(pressure: number) {
    if (this._brushPoint) {
      this._brushPoint.pressure = pressure;
    }
  }

  public getBrushName(): string|undefined {
    return this._brushPoint?.name;
  }

  public getBrushColor(): number {
    return this._brushPoint?.color || DEFAULT_COLOR;
  }

  public getBrushPressure(): number {
    return this._brushPoint?.pressure || DEFAULT_PRESSURE;
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
    this._prevVelocity = 0;
    // this._prevDistance = 0;
    // this._expectedNextPosition = null;
    this._acceleration = 0;
  }

  public drawEnd() {
    if (this._acceleration > 1) {
      // let pos = {
      //   x: this._expectedNextPosition?.x || 0,
      //   y: this._expectedNextPosition?.y || 0,
      //   t: (this._acceleration / (this._prevDistance * this._prevVelocity)) + (this._prevPosition?.t || 0),
      //   // p: this._prevPosition?.p * Math.min(this._acceleration / (this._prevDistance * this._prevVelocity), 1)
      // };
      // for (let i = 0, n = this._inertanceNum; i < n; i++) {
      //   // this._positions.push(pos);
      //   this.pushPosition(pos);
      // }
      // if (this._positions.length >= 2) {
      //   this.drawLine();
      // }
    }
  }

  public drawLine() {
    if (!this._brushPoint) {
      return;
    }
    const ctx = this._ctx;
    let pos = this._getBufferedCurrentPosition();
    if (pos == null) return;

    if (this._prevPosition == null) {
      this._prevPosition = pos;
    }
    
    let t = (pos.t - this._prevPosition.t);
    let distance = this._getDistance(pos, this._prevPosition);
    let velocity = distance / Math.max(1, t);
    let acceleration = (this._prevVelocity == 0) ? 0 : velocity / this._prevVelocity;
    const curve = function(velocity: number, size: number, sizeNegative: number, pressureRatio: number) {
      return sizeNegative * velocity / pressureRatio + size;
    }

    let pressureRatio = this._brushPoint.pressure * 20;
    pressureRatio = Math.min(Math.max(pressureRatio, 1), 20);
    let brushSize = Math.max(
      this._brushPoint.minSize,
      curve(
        velocity,
        this._brushPoint.maxSize,
        (0 - this._brushPoint.maxSize) - this._brushPoint.minSize,
        pressureRatio,
      )
    );
    
    
    ctx.save();
    this._drawPath(ctx, this._prevPosition, pos, brushSize, distance);
    ctx.restore();

    this._acceleration = acceleration;
    // this._expectedNextPosition = this._getInterlatePos(this._prevPosition, pos, 1 + this._acceleration);
    this._prevPosition = pos;
    this._prevBrushSize = brushSize;
    this._prevVelocity = velocity;
    // this._prevDistance = distance;
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
    let brushDelta = (brushSize - (this._prevBrushSize || 0));
  
    while (t < 1) {
      let brushSizeCur = Math.min((this._prevBrushSize || 0) + (brushDelta * t), this._brushPoint.maxSize);
      let pos = this._getInterlatePos(startPos, endPos, t);
      // if (Math.random() > 0.2) {
        let px = pos.x;
        let py = pos.y;
        ctx.drawImage(this._brushPoint.pattern, px, py, brushSizeCur, brushSizeCur);
      // }
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

}