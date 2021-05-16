import Board from '@idraw/paint-board';
import { setStyle } from './util/style';
import { Progress } from './components/progress';
import { ActionSheet } from './components/action-sheet';
import { Menu } from './modules/menu';
import { Nav } from './modules/nav';
import { Color } from './modules/color';
import { Size } from './modules/size';
import { Brush } from './modules/brush';
import { Pressure } from './modules/pressure';
import { eventCode, eventHub } from './service/event';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
  onChangeColor?(color: string): void;
  onChangeSize?(size: number): void;
  onChangeBrush?(name: string): void;
  onChangePressure?(pressyre: number): void;
}

export default class Container {

  private _opts: Options;
  private _dom: HTMLElement;
  private _board: Board;
  private _wrapper: HTMLDivElement;
  // private _mask: HTMLDivElement;
  // private _canvas: HTMLCanvasElement;
  private _header: HTMLDivElement;
  private _footer: HTMLDivElement;
  private _isReady: boolean = false;
  private _scaleProgress?: Progress;
  private _canvasScaleRatio: number = 1;

  private _actionColor?: ActionSheet;
  private _actionSize?: ActionSheet;
  private _actionBrush?: ActionSheet;
  private _actionPressure?: ActionSheet;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = opts;
    const { width, height, canvasWidth, canvasHeight } = this._opts;
    
    this._wrapper= document.createElement('div');
    this._header = document.createElement('div');
    this._footer = document.createElement('div');
    this._canvasScaleRatio = Math.min(1, 1 / Math.max(canvasWidth / width, canvasHeight / height));
    this._wrapper.classList.add('idraw-board-wrapper');
    setStyle(this._wrapper, { width: `${width}px`, height: `${height}px`});
    this._board = new Board(this._wrapper, {
      width, height,
      canvasWidth, canvasHeight,
      devicePixelRatio: window.devicePixelRatio,
    });
  }
 
  public render() {
    if (this._isReady === true) {
      return;
    }
    this._board.render();
    this._board.setCanvasScale(this._canvasScaleRatio);
    this._dom.appendChild(this._wrapper);
    this._initHeader();
    this._initFooter();
    this._initComponents();
    this._initGlobalEvent();
    this._isReady = true;
  }


  // public moveCanvas(x: number, y: number) {
  //   const matrix = getDomTransform(this._canvas);
  //   matrix.translateX = matrix.translateX + x;
  //   matrix.translateY = matrix.translateY + y;
  //   setDomTransform(this._canvas, matrix);
  // }

  public getBoard() {
    return this._board;
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

  public showActionSize(isShow: boolean = true) {
    if (isShow === true) {
      this._actionSize?.show();
    } else {
      this._actionSize?.hide();
    }
  }

  public showActionBrush(isShow: boolean = true) {
    if (isShow === true) {
      this._actionBrush?.show();
    } else {
      this._actionBrush?.hide();
    }
  }

  public showActionPressure(isShow: boolean = true) {
    if (isShow === true) {
      this._actionPressure?.show();
    } else {
      this._actionPressure?.hide();
    }
  }

  // public setCanvasBackgroundImage(src: string) {
  //   setStyle(this._canvas, {
  //     'background': `url(${src}) no-repeat`,
  //     'background-position': 'center',
  //     'background-size': `${this._canvas.width}px`
  //   })
  // }

  // private _scaleCanvas(scale: number) {
  //   const transform = getDomTransform(this._canvas);
  //   transform.scaleX = scale;
  //   transform.scaleY = scale;
  //   setDomTransform(this._canvas, transform);
  // }

  private _initFooter() {
    if (this._isReady === true) {
      return;
    }
    this._wrapper.appendChild(this._footer);
    this._footer.classList.add('idraw-board-footer');
    const menu = new Menu({ mount: this._footer });
    menu.render();
  }

  private _initHeader() {
    if (this._isReady === true) {
      return;
    }
    this._wrapper.appendChild(this._header);
    this._header.classList.add('idraw-board-header');
    const nav = new Nav({ mount: this._header });
    nav.render();
  }

  private _initComponents() {
    if (this._isReady === true) {
      return;
    }
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
          // this._scaleCanvas(this._canvasScaleRatio);
        }
      }
    });

    // let colorSelector: Color;
    this._actionColor = new ActionSheet({
      mount: this._wrapper,
      zIndex: 1,
      afterRender: (opts: { contentMount: HTMLElement }) => {
        const { contentMount } = opts;
        const colorSelector = new Color({ 
          mount: contentMount,
          onChange: (color: string) => {
            if (typeof this._opts.onChangeColor === 'function') {
              this._opts.onChangeColor(color);
            }
          }
        });
        colorSelector.render();
      }
    });
    this._actionSize = new ActionSheet({
      mount: this._wrapper,
      zIndex: 1,
      afterRender: (opts: { contentMount: HTMLElement }) => {
        const { contentMount } = opts;
        const sizer = new Size({ 
          mount: contentMount,
          onChange: (size: number) => {
            if (typeof this._opts.onChangeSize === 'function') {
              this._opts.onChangeSize(size);
            }
          }
        });
        sizer.render();
      }
    });
    this._actionBrush = new ActionSheet({
      mount: this._wrapper,
      zIndex: 1,
      afterRender: (opts: { contentMount: HTMLElement }) => {
        const { contentMount } = opts;
        const sizer = new Brush({ 
          mount: contentMount,
          onChange: (name: string) => {
            if (typeof this._opts.onChangeBrush === 'function') {
              this._opts.onChangeBrush(name);
            }
          }
        });
        sizer.render();
      }
    });
    this._actionPressure = new ActionSheet({
      mount: this._wrapper,
      zIndex: 1,
      afterRender: (opts: { contentMount: HTMLElement }) => {
        const { contentMount } = opts;
        const sizer = new Pressure({ 
          mount: contentMount,
          onChange: (pressure: number) => {
            if (typeof this._opts.onChangePressure === 'function') {
              this._opts.onChangePressure(pressure);
            }
          }
        });
        sizer.render();
      }
    });
  }

  private _initGlobalEvent() {
    if (this._isReady === true) {
      return;
    }
    const board = this._board;
    eventHub.on(eventCode.BOARD_CLEAR, () => {
      board.clear();
    });
    eventHub.on(eventCode.UNDO, () => {
      board.undo();
    });
    eventHub.on(eventCode.DOWNLOAD, () => {
      board.download('paint');
    });
    eventHub.on(eventCode.LOG_DATA, () => {
      const data = board.getData();
      // TODO
      console.log('data ===', data);
    })

  }

}