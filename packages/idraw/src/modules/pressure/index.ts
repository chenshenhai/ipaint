import { Progress } from './../../components/progress';
import { DEFAULT_PRESSURE } from './../../util/constant';


type ModOptions = {
  mount: HTMLElement;
  onChange(value: number): void;
}


export class Pressure {

  private _opts: ModOptions;
  private _isMounted: boolean = false;
  private _mount: HTMLElement;
  private _component: HTMLDivElement;
  private _progress?: Progress;

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
      <div class="idraw-board-pressure-container">
        <div class="idraw-board-pressure-content"></div>
      </div>
    `;
    this._mount.appendChild(this._component);
    this._onEvent();
    this._isMounted = true;
  }

  public setValue(value: number) {
    this._progress?.resetPercent(value * 100);
  }

  private _onEvent() {
    if (this._isMounted === true) {
      return;
    } 
    const content: HTMLDivElement = this._component.querySelector('.idraw-board-pressure-content') as HTMLDivElement;
    this._progress = new Progress({
      mount: content,
      customStyle: { 'display': 'flex' },
      percent:  DEFAULT_PRESSURE * 100, // [0, 100];
      onChange: (data: { value: number }) => {
        this._opts.onChange(data.value / 100);
      },
      // max?: number, // default 100
      // min?: number, // default 0
    })
  }

}