// import { eventCode, eventHub } from '../../service/event';
import './style.less';


type ModOptions = {
  mount: HTMLElement;
}


export class Module {

  private _opts: ModOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;

  constructor(opts: ModOptions) {
    this._opts = opts;
    this._mount = this._opts.mount;
  }

  public render() {
    if (this._isMounted === true) {
      return;
    }
    this._mount.innerHTML = `
      <div class="ipaint-board-mod-container">
        ${'hello module'}
      </div>
    `;
    this._onEvent();
    this._isMounted = true;
  }

  private _onEvent() {
    if (this._isMounted === true) {
      return;
    } 
    // TODO
  }

}