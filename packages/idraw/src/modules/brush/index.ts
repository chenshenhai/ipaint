// import { eventCode, eventHub } from '../../service/event';
// import './style.less';
import brush from '@idraw/brush';


type ModOptions = {
  mount: HTMLElement;
  onChange(name: BrushNameType): void;
}

type BrushNameType = ('ink' | 'light');

const brushNameList: BrushNameType[] = [
  'ink',
  'light'
]

export class Brush {

  private _opts: ModOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;
  private _component: HTMLDivElement;

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
      <div class="idraw-board-brush-container">
        <div class="idraw-board-brush-content">
          ${brushNameList.map((name: BrushNameType) => {
            return `
            <div class="idraw-board-brush-item" data-brush-name="${name}">
              <img class="idraw-board-brush-img" src="${brush[name].src}" />
            </div>
            `;
          }).join('\r\n')}
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
    const items = this._component.querySelectorAll('[data-brush-name]');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const name = item.getAttribute('data-brush-name') as BrushNameType;
        this._opts.onChange(name);
      }, false);
    });
    
  }

}