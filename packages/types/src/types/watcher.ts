import { TypeDataPosition } from './data';

export interface TypeWatcher {

  onDraw(callback: TypeWatchCallback): void,

  onDrawEnd(callback: TypeWatchCallback): void,

  onDrawEnd(callback: TypeWatchCallback): void,
}


export type TypeWatchCallback = (p: TypeDataPosition) => void
