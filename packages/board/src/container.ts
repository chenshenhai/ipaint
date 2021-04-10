type Options = {
  width: number;
  height: number;
}

export default class Container {

  private _opts: Options;
  private _dom: HTMLElement;
  private _canvas: HTMLCanvasElement;

  constructor(dom: HTMLElement, opts: Options) {
    this._dom = dom;
    this._opts = opts;
    this._canvas = document.createElement('canvas');
  }

  public render() {

  }


  private _renderCanvas() {

  }

}