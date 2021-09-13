import { DEFAULT_SIZE } from './../../util/constant';

type ModOptions = {
  mount: HTMLElement;
  onChange(size: number): void;
}


export class Size {

  private _opts: ModOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;
  private _size: number = DEFAULT_SIZE;
  private _component: HTMLDivElement;
  private _input?: HTMLInputElement;
  private _btn?: HTMLButtonElement;

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
      <div class="ipaint-board-size-container">
        <div class="ipaint-board-size-content">
          <input class="ipaint-board-size-input" type="number" value="${this._size}" />
          <button class="ipaint-board-size-btn">OK</button>
        </div>
      </div>
    `;
    this._mount.appendChild(this._component);
    this._input = this._component.querySelector('input.ipaint-board-size-input') as HTMLInputElement;
    this._btn = this._component.querySelector('button.ipaint-board-size-btn') as HTMLButtonElement;
    this._onEvent();
    this._isMounted = true;
  }

  public setSize(size: number) {
    this._size = size;
  }

  private _onEvent() {
    if (this._isMounted === true) {
      return;
    } 
    const input: HTMLInputElement|undefined = this._input;
    input?.addEventListener('input', () => {
      if (/^[0-9]{0,}$/.test(input?.value) !== true) {
        input.value = parseInt(input?.value) > 0 ? parseInt(input?.value) + '' : DEFAULT_SIZE + '';
      }
    }, false);

    const btn: HTMLButtonElement|undefined = this._btn;
    btn?.addEventListener('click', () => {
      if (typeof this._opts.onChange === 'function' && input) {
        if (input?.value && parseInt(input?.value) > 0) {
          this._opts.onChange(parseInt(input?.value));
        }
      }
    }, false);
  }

}