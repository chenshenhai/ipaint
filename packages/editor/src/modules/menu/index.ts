import { eventCode, eventHub } from '../../service/event';

type MenuOptions = {
  mount: HTMLElement;
}

const menuConfig = {
  list: [{
    name: 'Scale',
    key: 'scale',
  }, {
    name: 'Color',
    key: 'color',
  }, {
    name: 'Size',
    key: 'size',
  }, {
    name: 'Brush',
    key: 'brush',
  },{
    name: 'Pressure',
    key: 'pressure',
  }]
}

export class Menu {

  private _opts: MenuOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;

  constructor(opts: MenuOptions) {
    this._opts = opts;
    this._mount = this._opts.mount;
  }

  public render() {
    if (this._isMounted === true) {
      return;
    }
    this._mount.innerHTML = `
      <div class="ipaint-board-menu-container">
        <div class="ipaint-board-menu-list">
        ${menuConfig.list.map((item) => {
          return `
            <div 
              class="ipaint-board-menu-item ipaint-board-menu-icon-${item.key}"
              data-menu-key="${item.key}" >
              ${item.name}
            </div>
          `
        }).join('\r\n')}
        </div>
      </div>
    `;
    this._onEvent();
    this._isMounted = true;
  }

  private _onEvent() {
    if (this._isMounted === true) {
      return;
    } 

    const items = this._mount.querySelectorAll('[data-menu-key]');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-menu-key') || '';
        this._emitEvent(key);
      }, false);
    });
  }

  private _emitEvent(key: string) {
    console.log('key =', key);
    eventHub.trigger(eventCode.CLEAR_ACTION);
    if (key === 'scale') {
      eventHub.trigger(eventCode.SCALE_CANVAS);
    } else if (key === 'color') {
      eventHub.trigger(eventCode.SHOW_COLOR_SELECTOR);
    } else if (key === 'size') {
      eventHub.trigger(eventCode.SHOW_SIZER)
    } else if (key === 'brush') {
      eventHub.trigger(eventCode.SHOW_BRUSH_SELECTOR)
    } else if (key === 'pressure') {
      eventHub.trigger(eventCode.SHOW_PRESSURE)
    }
  }

}