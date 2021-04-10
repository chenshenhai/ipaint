import './css/container.less';
import { setStyle } from './style';

type Options = {
  width: number;
  height: number;
}

export default class Container {

  private _opts: Options;
  private _dom: HTMLElement;
  private _wrapper: HTMLDivElement;
  private _canvas: HTMLCanvasElement;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = opts;
    this._wrapper= document.createElement('div');
    this._canvas = document.createElement('canvas');
    const { width, height } = this._opts;

    this._canvas.width = width;
    this._canvas.height = height;
    this._wrapper.classList.add('idraw-board-wrapper');
    setStyle(this._wrapper, { width: `${width}px`, height: `${height}px`});
    setStyle(this._canvas, { width: `${width}px`, height: `${height}px` })
  }

  public render() {
    this._wrapper.appendChild(this._canvas);
    this._dom.appendChild(this._wrapper);
  }

  public getCanvas() {
    return this._canvas;
  }


}