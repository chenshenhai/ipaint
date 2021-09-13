import Container from './container';
import './css/index.less';

type Options = {
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}

export default class Paint {

  private _dom: HTMLElement;
  private _container: Container;
  private _isStart: boolean = false;
  
  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._container = new Container(this._dom, {
      ...opts,
    });
  }

  async ready() {
    if (this._isStart === true) {
      return;
    }
    this._container.render();
  }

}



