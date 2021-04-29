import EventEmitter from '../util/event-emitter';

export const eventHub = new EventEmitter();

export const eventCode = {
  BOARD_CLEAR: 'board-clear',
  DOWNLOAD: 'download',
  LOG_DATA: 'log-data',
  UNDO: 'undo',
  SCALE_CANVAS: 'scale_canvas',
  SHOW_COLOR_SELECTOR: 'show-color-selector'
}