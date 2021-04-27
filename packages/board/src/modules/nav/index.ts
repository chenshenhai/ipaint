import { eventCode, eventHub } from '../../service/event';
import './style.less';


type MenuOptions = {
  mount: HTMLElement;
}

const navConfig = {
  list: [{
    name: 'Log Data',
    key: 'log-data',
  }, {
    name: 'Download',
    key: 'download',
  }]
}

export class Nav {

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
    }
  }

}