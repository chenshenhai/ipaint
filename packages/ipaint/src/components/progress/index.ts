// import './index.less';

import { mergeCSS2StyleAttr } from '../../util/style';
import istype from '../../util/istype';


export interface ProgressOpts {
  mount: HTMLElement;
  customStyle: {};
  percent: number; // [0, 100];
  onChange: Function|null;
  max?: number, // default 100
  min?: number, // default 0
}


export interface ProcessOnChangeData {
  value: number; // [0, 100]
}

export class Progress {
  private _options: ProgressOpts;
  private _hasRendered: boolean = false;
  private _component?: HTMLElement;
  private _rangeList: number[];

  constructor(opts: ProgressOpts) {
    this._options = opts;
    this._render();
    this._rangeList = [];

    const options = this._options;
    const { max = 100,  min = 0 } = options;
    this.resetRange(min, max);
  }

  private _render() {
    if (this._hasRendered === true) {
      return;
    }
    const options = this._options;
    const { mount, customStyle, percent, } = options;
    const styleAttr = mergeCSS2StyleAttr(customStyle);
    const html = `
      <div class="ipaint-board-component-progress" style="${styleAttr}">
        <div class="ipaint-board-progress-outer">
          <div class="ipaint-board-progress-inner"></div>
        </div>
      </div>
    `;

    const tempDom = document.createElement('div');;
    tempDom.innerHTML = html;
    const component: HTMLDivElement | null = tempDom.querySelector('div.ipaint-board-component-progress');
    if (component) {
      mount.appendChild(component);
      this._component = component;
      this._component.classList.add('progress-hidden');
      this._setInnerMovePercent(percent);
      this._triggerEvent();
    }
  }

  show() {
    this._component?.classList.remove('progress-hidden');
  }

  hide() {
    this._component?.classList.add('progress-hidden');
  }

  resetPercent(percent: number) {
    this._setInnerMovePercent(percent);
  }

  // resetOnChange(onChange: Function|null) {
  //   this._options.onChange = onChange;
  // }

  resetRange(min: number, max: number) {
    this._rangeList = [];
    const item = (max - min) / 100;
    for (let i = min; i < max; i += item) {
      this._rangeList.push(i);
    }
    this._rangeList.push(max);
  }

  private _triggerEvent() {
    const that = this;
    const component = this._component;
    const outer = component?.querySelector('.ipaint-board-progress-outer'); 
    if (!outer) {
      return;
    }
    // @ts-ignore
    outer.addEventListener('touchstart', function(event: TouchEvent) {
      const touchClientX = event.touches[0].clientX;
      let movePercent = that._calculateMovePercent(touchClientX);
      that._setInnerMovePercent(movePercent);
    }, false);
    // @ts-ignore
    outer.addEventListener('touchmove', function(event: TouchEvent) {
      const touchClientX = event.touches[0].clientX;
      let movePercent = that._calculateMovePercent(touchClientX);
      that._setInnerMovePercent(movePercent);
    }, false);
    outer.addEventListener('touchend', function() {
      const value = that._getInnerValue();
      const data: ProcessOnChangeData = {
        value,
      }
      const options = that._options;
      const { onChange, } = options;
      if (istype.function(onChange)) {
        onChange && onChange(data);
      }
    });

    // @ts-ignore
    outer.addEventListener('mousedown', function(event: MouseEvent) {
      const touchClientX = event.clientX;
      let movePercent = that._calculateMovePercent(touchClientX);
      that._setInnerMovePercent(movePercent);
    })
    // outer.addEventListener('mousemove', function(event: MouseEvent) {
    //   const touchClientX = event.clientX;
    //   let movePercent = that._calculateMovePercent(touchClientX);
    //   that._setInnerMovePercent(movePercent);
    // });
    outer.addEventListener('mouseup', function() {
      const value = that._getInnerValue();
      const data: ProcessOnChangeData = {
        value,
      }
      const options = that._options;
      const { onChange, } = options;
      if (istype.function(onChange)) {
        onChange && onChange(data);
      }
    });
  }

  private _calculateMovePercent(touchClientX: number): number {
    const component = this._component;
    const outer = component?.querySelector('.ipaint-board-progress-outer');
    if (!outer) {
      return 0;
    }
    // @ts-ignore
    const outerLeft = this._getViewAbsoluteLeft(outer);
    const outerWidth = outer.clientWidth;
    const moveLelf = touchClientX - outerLeft;
    let movePercent = Math.ceil(moveLelf * 100 / outerWidth);
    return movePercent;
  }

  private _setInnerMovePercent(percent: number) {
    const component = this._component;
    const inner = component?.querySelector('.ipaint-board-progress-inner');
    let displayPercent = percent > 0 ? percent : 0;
    displayPercent = Math.min(displayPercent, 100);
    displayPercent = Math.max(displayPercent, 0);
    const innerStyleAttr = mergeCSS2StyleAttr({
      left: `-${100 - displayPercent}%`
    });
    inner?.setAttribute('style', innerStyleAttr);
    inner?.setAttribute('data-component-inner-percent', `${displayPercent}`);
  }

  private _getInnerValue() {
    const component = this._component;
    const inner = component?.querySelector('.ipaint-board-progress-inner');
    const percentAttr: string = inner?.getAttribute('data-component-inner-percent') || '';
    let percent = parseInt(percentAttr, 10);
    percent = Math.min(100, percent);
    percent = Math.max(0, percent);
    const value = this._rangeList[percent]
    return value;
  }

  private _getViewAbsoluteLeft(elem: HTMLElement){
    let actualLeft = elem.offsetLeft;
    let current = elem.offsetParent;

    while (current !== null){
      // @ts-ignore
      actualLeft += current.offsetLeft;
      // @ts-ignore
      current = current.offsetParent;
    }
    return actualLeft;
  }
  
}