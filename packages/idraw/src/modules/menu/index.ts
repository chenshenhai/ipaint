import { eventCode, eventHub } from '../../service/event';
import './style.less';


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
  }, {
    name: 'Clear',
    key: 'clear',
  },]
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
      <div class="idraw-board-menu-container">
        <div class="idraw-board-menu-list">
        ${menuConfig.list.map((item) => {
          return `
            <div 
              class="idraw-board-menu-item"
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
    if (key === 'clear') {
      eventHub.trigger(eventCode.BOARD_CLEAR);
    } else if (key === 'scale') {
      eventHub.trigger(eventCode.SCALE_CANVAS);
    } else if (key === 'color') {
      eventHub.trigger(eventCode.SHOW_COLOR_SELECTOR);
    }
  }

}