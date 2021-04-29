import './css/container.less';
import { setStyle, getDomTransform, setDomTransform } from './util/style';
import { Menu } from './modules/menu';
import { Nav } from './modules/nav';
import { Progress } from './components/progress';
import { ActionSheet } from './components/action-sheet';

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
  private _mask: HTMLDivElement;
  private _canvas: HTMLCanvasElement;
  private _header: HTMLDivElement;
  private _footer: HTMLDivElement;
  private _isReady: boolean = false;
  private _scaleProgress?: Progress;
  private _canvasScaleRatio: number = 1;

  private _actionColor?: ActionSheet;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = opts;
    const { width, height, canvasWidth, canvasHeight } = this._opts;
    this._wrapper= document.createElement('div');
    this._mask = document.createElement('div');
    this._canvas = document.createElement('canvas');
    this._header = document.createElement('div');
    this._footer = document.createElement('div');
    this._canvasScaleRatio = Math.min(1, 1 / Math.max(canvasWidth / width, canvasHeight / height));
    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this._wrapper.classList.add('idraw-board-wrapper');
    this._mask.classList.add('idraw-board-mask');
    this._canvas.classList.add('idraw-board-canvas');
    setStyle(this._wrapper, { width: `${width}px`, height: `${height}px`});
    setStyle(this._canvas, { width: `${canvasWidth}px`, height: `${canvasHeight}px`, transform: 'scale(1.0)' });
  }
 
  public render() {
    if (this._isReady === true) {
      return;
    }
    this._wrapper.appendChild(this._canvas);
    this._wrapper.appendChild(this._mask);
    this._dom.appendChild(this._wrapper);
    this._initHeader();
    this._initFooter();
    this._initComponents();

    this._scaleCanvas(this._canvasScaleRatio);
    this._isReady = true;
  }

  public getCanvas() {
    return this._canvas;
  }

  public getMask() {
    return this._mask;
  }

  public moveCanvas(x: number, y: number) {
    const matrix = getDomTransform(this._canvas);
    matrix.translateX = matrix.translateX + x;
    matrix.translateY = matrix.translateY + y;
    setDomTransform(this._canvas, matrix);
  }

  public showScaleProgress(isShow: boolean = true) {
    if (isShow === true) {
      this._scaleProgress?.resetPercent(this._canvasScaleRatio * 100)
      this._scaleProgress?.show();
    } else {
      this._scaleProgress?.hide();
    }
  }

  public showActionColor(isShow: boolean = true) {
    if (isShow === true) {
      this._actionColor?.show();
    } else {
      this._actionColor?.hide();
    }
  }

  public _scaleCanvas(scale: number) {
    const transform = getDomTransform(this._canvas);
    transform.scaleX = scale;
    transform.scaleY = scale;
    setDomTransform(this._canvas, transform);
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

  private _initComponents() {
    this._scaleProgress = new Progress({
      mount: this._wrapper,
      max: 100,
      min: 0,
      customStyle: {
        'position': 'absolute',
        'bottom': '140px',
        'left': '5%',
        'right': '5%',
        'width': 'auto',
      },
      percent: 0,
      onChange: (data: any) => {
        if (data && data.value > 0) {
          this._canvasScaleRatio = data.value / 100;
          this._scaleCanvas(this._canvasScaleRatio);
        }
      }
    });
    this._actionColor = new ActionSheet({
      mount: this._wrapper,
      height: 200,
      zIndex: 1,
      afterRender: (opts: { contentMount: HTMLElement }) => {
        const { contentMount } = opts;
        contentMount.innerText = 'hello color'
      }
    })
  }

}