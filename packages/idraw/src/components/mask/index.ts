import './index.less';

export interface MaskAfterRenderArgs {
  contentMount: HTMLElement;
  headerMount: HTMLElement;
  footerMount: HTMLElement;
}

export interface MaskOpts {
  zIndex: number;
  afterRender: Function;
}

export class Mask {

  private _options: MaskOpts;
  private _hasRendered: boolean = false;
  private _component?: HTMLDivElement;

  constructor(opts: MaskOpts) {
    this._options = opts;
    this._render();
  }
  
  show() {
    this._component?.classList.add('mask-open');
  }

  hide() {
    this._component?.classList.remove('mask-open');
  }

  private _render() {
    if (this._hasRendered === true) {
      return;
    }
    const options = this._options;
    const { zIndex, afterRender } = options;
    const html = `
    <div class="idraw-board-component-mask" style="z-index: ${zIndex}">
      <div class="idraw-board-mask-container">
        <div class="idraw-board-mask-header"></div>
        <div class="idraw-board-mask-content"></div>
        <div class="idraw-board-mask-footer"></div>
      </div>
    </div>
    `;
    const body = document.querySelector('body');
    const mountDom = document.createElement('div');;
    mountDom.innerHTML = html;
    const component : HTMLDivElement | null = mountDom.querySelector('div.idraw-board-component-mask')
    if (component) {
      body?.appendChild(component);

      const contentMount: HTMLDivElement | null = component.querySelector('div.idraw-board-mask-content');
      const headerMount: HTMLDivElement | null = component.querySelector('div.idraw-board-mask-header');
      const footerMount: HTMLDivElement | null = component.querySelector('div.idraw-board-mask-footer');

      if (typeof afterRender === 'function' && contentMount && headerMount && footerMount) {
        const args: MaskAfterRenderArgs = { contentMount, headerMount, footerMount};
        afterRender(args)
      }
      this._hasRendered = true;
      this._component = component;
    }
  }
}

