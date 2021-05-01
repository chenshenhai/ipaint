import { eventCode, eventHub } from '../../service/event';
import './style.less';


type NavOptions = {
  mount: HTMLElement;
}

const navConfig = {
  list: [{
    name: 'Undo',
    key: 'undo',
  }, {
    name: 'Clear',
    key: 'clear',
  }, {
    name: 'Download',
    key: 'download',
  }, {
    name: 'Log Data',
    key: 'log-data',
  }]
}

export class Nav {

  private _opts: NavOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;

  constructor(opts: NavOptions) {
    this._opts = opts;
    this._mount = this._opts.mount;
  }

  public render() {
    if (this._isMounted === true) {
      return;
    }
    this._mount.innerHTML = `
      <div class="idraw-board-nav-container">
        <div class="idraw-board-nav-list">
        ${navConfig.list.map((item) => {
          return `
            <div 
              class="idraw-board-nav-item"
              data-nav-key="${item.key}" >
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

    const items = this._mount.querySelectorAll('[data-nav-key]');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-nav-key') || '';
        this._emitEvent(key);
      }, false);
    });
  }

  private _emitEvent(key: string) {
    console.log('key =', key);
    if (key === 'log-data') {
      eventHub.trigger(eventCode.LOG_DATA);
    } else if (key === 'download') {
      eventHub.trigger(eventCode.DOWNLOAD);
    } else if (key === 'undo') {
      eventHub.trigger(eventCode.UNDO)
    } else if (key === 'clear') {
      eventHub.trigger(eventCode.BOARD_CLEAR)
    }
  }

}