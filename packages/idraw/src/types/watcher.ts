import { TypePosition } from './position';

export interface TypeWatcher {

  onDraw(callback: TypeWatchCallback): void,

  onDrawEnd(callback: TypeWatchCallback): void,

  onDrawEnd(callback: TypeWatchCallback): void,
}


export type TypeWatchCallback = (p: TypePosition) => void
