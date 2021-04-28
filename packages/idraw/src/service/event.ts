import EventEmitter from '../util/event-emitter';

export const eventHub = new EventEmitter();

export const eventCode = {
  BOARD_CLEAR: 'board-clear',
  DOWNLOAD: 'download',
  LOG_DATA: 'log-data',
  LOCK_DRAW: 'lock-draw',
  UNLOCK_DRAW: 'unlock-draw',
  SCALE_CANVAS: 'scale_canvas',
}