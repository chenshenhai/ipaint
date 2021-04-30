// import { eventCode, eventHub } from '../../service/event';
import './style.less';


type ModOptions = {
  mount: HTMLElement;
  onChange(size: number): void;
}


export class Size {

  private _opts: ModOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;
  private _size: number = 20;

  constructor(opts: ModOptions) {
    this._opts = opts;
    this._mount = this._opts.mount;
  }

  public render() {
    if (this._isMounted === true) {
      return;
    }
    this._mount.innerHTML = `
      <div class="idraw-board-size-container">
        ${'hello size module'}
        <div>
          <input type="number" value="${this._size}" />
        </div>
      </div>
    `;
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
    // TODO
  }

}