import EventEmitter from '../util/event-emitter';

export const eventHub = new EventEmitter();

export const eventCode = {
  BOARD_CLEAR: 'board-clear',
  DOWNLOAD: 'download',
  LOG_DATA: 'log-data',
  UNDO: 'undo',
  SCALE_CANVAS: 'scale_canvas',
  SHOW_COLOR_SELECTOR: 'show-color-selector',
  SHOW_SIZER: 'show-sizer',
  SHOW_BRUSH_SELECTOR: 'show-brush-selector',
  SHOW_PRESSURE: 'show-pressure',
  CLEAR_ACTION: 'clear-action',
  SET_COLOR: 'set-color',
  SET_SIZE: 'set-size',
  SET_BRUSH: 'set-brush',
  SET_PRESSURE: 'set-pressure',
}