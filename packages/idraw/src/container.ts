import './css/container.less';
import { setStyle } from './util/style';
import { Menu } from './modules/menu';
import { Nav } from './modules/nav';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}

export default class Container {

  private _opts: Options;
  private _dom: HTMLElement;
  private _wrapper: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _header: HTMLDivElement;
  private _footer: HTMLDivElement;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = opts;
    this._wrapper= document.createElement('div');
    this._canvas = document.createElement('canvas');
    this._header = document.createElement('div');
    this._footer = document.createElement('div');
    const { width, height, canvasWidth, canvasHeight } = this._opts;

    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this._wrapper.classList.add('idraw-board-wrapper');
    this._canvas.classList.add('idraw-board-canvas');
    setStyle(this._wrapper, { width: `${width}px`, height: `${height}px`});
    setStyle(this._canvas, { width: `${canvasWidth}px`, height: `${canvasHeight}px` });
    this._initHeader();
    this._initFooter();
  }

  public render() {
    this._wrapper.appendChild(this._canvas);
    this._dom.appendChild(this._wrapper);
  }

  public getCanvas() {
    return this._canvas;
  }


  private _initFooter() {
    this._wrapper.appendChild(this._footer);
    this._footer.classList.add('idraw-board-footer');
    const menu = new Menu({ mount: this._footer });
    menu.render();
  }

  private _initHeader() {
    this._wrapper.appendChild(this._header);
    this._header.classList.add('idraw-board-header');
    const nav = new Nav({ mount: this._header });
    nav.render();
  }


}