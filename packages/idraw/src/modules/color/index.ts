// import { eventCode, eventHub } from '../../service/event';
import './style.less';
import { colorList } from './../../util/constant';


type ModOptions = {
  mount: HTMLElement;
  onChange?(color: string): void;
}


export class Color {

  private _opts: ModOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;
  private _component: HTMLElement;

  constructor(opts: ModOptions) {
    this._opts = opts;
    this._mount = this._opts.mount;
    this._component = document.createElement('div');
  }

  public render() {
    if (this._isMounted === true) {
      return;
    }
    this._component.innerHTML = `
      <div class="idraw-board-color-container" >
        <div class="idraw-board-color-content">
          <div class="idraw-board-color-list">
            ${colorList.map((hex: string) => {
              return `
                <div class="idraw-board-color-item" data-color-item="${hex}">
                  <div class="idraw-board-color-btn" style="background: ${hex}" ></div>
                </div>
              `;
            }).join('\r\n')}
          </div>
        </div>
      </div>
    `;
    this._mount.appendChild(this._component);
    this._onEvent();
    this._isMounted = true;
  }

  private _onEvent() {
    if (this._isMounted === true) {
      return;
    } 
    const items = this._component.querySelectorAll('[data-color-item]');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const color = item.getAttribute('data-color-item') || '';
        if (typeof this._opts?.onChange === 'function') {
          this._opts?.onChange(color);
        }
      }, false);
    });
  }

}