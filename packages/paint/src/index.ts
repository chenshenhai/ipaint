import Container from './container';
import { eventCode, eventHub } from './service/event';
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
      ...{
        onChangeColor: (color: string) => {
          eventHub.trigger(eventCode.SET_COLOR, color);
          eventHub.trigger(eventCode.SHOW_COLOR_SELECTOR, false);
        },
        onChangeSize: (size: number) => {
          eventHub.trigger(eventCode.SET_SIZE, size);
          eventHub.trigger(eventCode.SHOW_SIZER, false);
        },
        onChangeBrush: (name: string) => {
          eventHub.trigger(eventCode.SET_BRUSH, name);
          eventHub.trigger(eventCode.SHOW_BRUSH_SELECTOR, false);
        },
        onChangePressure: (pressure: number) => {
          eventHub.trigger(eventCode.SHOW_PRESSURE, false);
          eventHub.trigger(eventCode.SET_PRESSURE, pressure);
        }
      }
    });
    
  }

  async ready() {
    if (this._isStart === true) {
      return;
    }
    this._container.render();
    
  }


}



