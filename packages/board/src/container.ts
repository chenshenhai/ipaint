import './css/container.less';
import { setStyle } from './util/style';
import { Menu } from './modules/menu';

type Options = {
  width: number;
  height: number;
}

export default class Container {

  private _opts: Options;
  private _dom: HTMLElement;
  private _wrapper: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _menu: HTMLDivElement;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = opts;
    this._wrapper= document.createElement('div');
    this._canvas = document.createElement('canvas');
    this._menu = document.createElement('div');
    const { width, height } = this._opts;

    this._canvas.width = width;
    this._canvas.height = height;
    this._wrapper.classList.add('idraw-board-wrapper');
    setStyle(this._wrapper, { width: `${width}px`, height: `${height}px`});
    setStyle(this._canvas, { width: `${width}px`, height: `${height}px` });
    this._initMenu();
  }

  public render() {
    this._wrapper.appendChild(this._canvas);
    this._dom.appendChild(this._wrapper);
  }

  public getCanvas() {
    return this._canvas;
  }

  private _initMenu() {
    this._wrapper.appendChild(this._menu);
    this._menu.classList.add('idraw-board-footer')
    const menu = new Menu({ mount: this._menu });
    menu.render();
  }


}