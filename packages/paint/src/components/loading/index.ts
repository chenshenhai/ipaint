// import './index.less';
// import { mergeCSS2StyleAttr } from '../../util/style';
// import istype from '../../util/istype';


export interface LoadingOpts {
  mount?: HTMLElement;
  zIndex: number; // ms
}

export class Loading {
  private _options: LoadingOpts;
  private _hasRendered: boolean = false;
  private _component?: HTMLElement;

  constructor(opts: LoadingOpts) {
    this._options = opts;
    this._render();
  }

  private _render() {
    if (this._hasRendered === true) {
      return;
    }
    const options = this._options;
    const { mount, zIndex, } = options;

    const html = `
      <div class="idraw-board-component-loading" style="z-index:${zIndex};">
        <div class="idraw-board-loading-outer">
          <div class="idraw-board-loading-inner"></div>
        </div>
      </div>
    `;

    const tempDom = document.createElement('div');;
    tempDom.innerHTML = html;
    const component: HTMLDivElement | null = tempDom.querySelector('div.idraw-board-component-loading');
    if (component) {
      if (mount instanceof HTMLElement) {
        mount.appendChild(component);
      } else {
        const body = document.querySelector('body');
        body?.appendChild(component);
      }
      this._component = component;
    }
  }

  show(timeout: number = 800) {
    const that = this;
    this._component?.classList.add('loading-show');
    if (timeout > 0) {
      setTimeout(function() {
        that.hide();
      }, timeout)
    }
  }

  hide() {
    this._component?.classList.remove('loading-show');
  }
  
}