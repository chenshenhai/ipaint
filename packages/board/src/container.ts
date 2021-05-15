import { setStyle } from './util/style';

type Options = {
  width: number;
  height: number;
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
  private _mask: HTMLDivElement;
  private _canvas: HTMLCanvasElement; 
  private _isReady: boolean = false; 

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = { ...defaultOpts, ...opts};
    const { width, height, } = this._opts;
    this._wrapper= document.createElement('div');
    this._mask = document.createElement('div');
    this._canvas = document.createElement('canvas');

    this._canvas.width = width * this._opts.devicePixelRatio;
    this._canvas.height = height * this._opts.devicePixelRatio;

    // this._wrapper.classList.add('idraw-board-wrapper');
    // this._mask.classList.add('idraw-board-mask');
    // this._canvas.classList.add('idraw-board-canvas');
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
      width: `${width}px`,
      height: `${height}px`,
      transform: 'scale(1.0)',
      display: 'flex',
    });
    setStyle(this._mask, {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
    })
  }
 
  public render() {
    if (this._isReady === true) {
      return;
    }
    this._wrapper.appendChild(this._canvas);
    this._wrapper.appendChild(this._mask);
    this._dom.appendChild(this._wrapper);
    this._isReady = true;
  }

  public getCanvas() {
    return this._canvas;
  }

  public getMask() {
    return this._mask;
  }


}