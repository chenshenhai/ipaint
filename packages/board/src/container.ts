import { setStyle, getDomTransform, setDomTransform } from './util/style';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
  devicePixelRatio?: number;
}

type PrivateOpts = {
  devicePixelRatio: number
} & Options

const defaultOpts = {
  devicePixelRatio: 1
}

export default class Container {

  private _opts: PrivateOpts;
  private _dom: HTMLElement;
  private _wrapper: HTMLDivElement;
  private _canvas: HTMLCanvasElement; 
  private _canvasScaleRatio: number = 1;
  private _isReady: boolean = false; 

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = { ...defaultOpts, ...opts};
    const { width, height, canvasWidth, canvasHeight } = this._opts;
    this._wrapper= document.createElement('div');
    this._canvas = document.createElement('canvas');

    this._canvas.width = canvasWidth * this._opts.devicePixelRatio;
    this._canvas.height = canvasHeight * this._opts.devicePixelRatio;

    setStyle(this._wrapper, {
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      overflow: 'hidden',
    });
    setStyle(this._canvas, {
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
      // transform: 'scale(1.0)',
      transform: 'matrix(1, 0, 0, 1, 0, 0)',
      display: 'flex',
    });
  }
 
  public render() {
    if (this._isReady === true) {
      return;
    }
    this._wrapper.appendChild(this._canvas);
    this._dom.appendChild(this._wrapper);
    this._isReady = true;
  }

  public getCanvas() {
    return this._canvas;
  }

  public moveCanvas(x: number, y: number) {
    const matrix = getDomTransform(this._canvas);
    matrix.translateX = matrix.translateX + x;
    matrix.translateY = matrix.translateY + y;
    setDomTransform(this._canvas, matrix);
  }

  public setCanvasScale(scale: number) {
    const transform = getDomTransform(this._canvas);
    transform.scaleX = scale;
    transform.scaleY = scale;
    setDomTransform(this._canvas, transform);
    this._canvasScaleRatio = scale;
  }

  public getCanvasScale(): number {
    return this._canvasScaleRatio;
  }

}