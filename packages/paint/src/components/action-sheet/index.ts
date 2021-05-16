// import './index.less';

export interface ActionSheetLifeCycleArgs {
  contentMount: HTMLElement;
}

export interface ActionSheetOpts {
  height?: number;
  zIndex: number;
  beforeRender?: Function;
  afterRender?: Function;
  beforeShow?: Function;
  afterShow?: Function;
  beforeHide?: Function;
  afterHide?: Function;
  mount?: HTMLElement;
}

export class ActionSheet {

  private _options: any;
  private _hasRendered: boolean = false;
  private _component?: HTMLDivElement;
  private _contentMount?: HTMLDivElement;

  constructor(opts: ActionSheetOpts) {
    this._options = opts;
    this._render();
  }
  
  show() {
    const { beforeShow, afterShow, } = this._options;
    const contentMount = this._contentMount;
    if (typeof beforeShow === 'function') {
      beforeShow({ contentMount });
    }
    this._component?.classList.add('actionsheet-open');
    if (typeof afterShow === 'function') {
      afterShow({ contentMount });
    }
  }

  hide() {
    const { beforeHide, afterHide, } = this._options;
    const contentMount = this._contentMount;
    if (typeof beforeHide === 'function') {
      beforeHide({ contentMount });
    }
    this._component?.classList.remove('actionsheet-open');
    if (typeof afterHide === 'function') {
      afterHide({ contentMount });
    }
  }

  private _render() {
    if (this._hasRendered === true) {
      return;
    }
    const { afterRender, beforeRender, mount, } = this._options;
    if (typeof beforeRender === 'function') {
      beforeRender();
    }
    const opts: ActionSheetOpts = this._options;
    const { height, zIndex, } = opts;
    const html = `
    <div class="idraw-board-component-actionsheet" style="z-index: ${zIndex};">
      <div class="idraw-board-actionsheet-mask"></div>
      <div class="idraw-board-actionsheet-container" style="${height && height > 0 ? 'height:px' : ''};">
        <div class="idraw-board-actionsheet-header"></div>
        <div class="idraw-board-actionsheet-content"></div>
        <div class="idraw-board-actionsheet-footer"></div>
      </div>
    </div>
    `;
    // const body = document.querySelector('body');
    const mountDom = document.createElement('div');;
    mountDom.innerHTML = html;
    const component: HTMLDivElement|null = mountDom?.querySelector('div.idraw-board-component-actionsheet')
    if (component) {
      if (mount) {
        mount.appendChild(component);
      }
      // else {
      //   body?.appendChild(component);
      // }

      const contentMount: HTMLDivElement|null = component.querySelector('div.idraw-board-actionsheet-content');

      if (contentMount) {
        if (typeof afterRender === 'function') {
          const args: ActionSheetLifeCycleArgs = { contentMount, };
          afterRender(args)
        }
        this._contentMount = contentMount;
        this._component = component;
        this._onEvent();
        this._hasRendered = true;
      }
      
    }
  }
  
  private _onEvent() {
    const mask = this._component?.querySelector('div.idraw-board-actionsheet-mask');
    mask?.addEventListener('click', this._onMaskClose.bind(this), false);
  }

  private _onMaskClose(e: Event) {
    this.hide();
  }
}

