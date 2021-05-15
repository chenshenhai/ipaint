import { TypeDataPosition } from '@idraw/types'

interface DrawEventArgMap {
  'draw': TypeDataPosition;
  "drawStart": TypeDataPosition;
  "drawEnd": TypeDataPosition;
}

interface TypeDrawEvent {
  on<T extends keyof DrawEventArgMap >(key: T, callback: (p: DrawEventArgMap[T]) => any): void
  off<T extends keyof DrawEventArgMap >(key: T, callback: (p: DrawEventArgMap[T]) => any): void
  trigger<T extends keyof DrawEventArgMap >(key: T, p: DrawEventArgMap[T]): void
}


export default class EventEmitter implements TypeDrawEvent {

  private _listeners: Map<string, Function[]>;

  constructor() {
    this._listeners = new Map();
  }

  on<T extends keyof DrawEventArgMap >(eventKey: T, callback: (p: DrawEventArgMap[T]) => any) {
    if (this._listeners.has(eventKey)) {
      const callbacks = this._listeners.get(eventKey);
      callbacks?.push(callback);
      this._listeners.set(eventKey, callbacks || [])
    } else {
      this._listeners.set(eventKey, [callback]);
    }
  }
  
  off<T extends keyof DrawEventArgMap >(eventKey: T, callback: (p: DrawEventArgMap[T]) => any) {
    if (this._listeners.has(eventKey)) {
      const callbacks = this._listeners.get(eventKey);
      if (Array.isArray(callbacks)) {
        for (let i = 0; i < callbacks?.length; i++) {
          if (callbacks[i] === callback) {
            callbacks.splice(i, 1);
            break;
          }
        }
      }
      this._listeners.set(eventKey, callbacks || [])
    }
  }

  trigger<T extends keyof DrawEventArgMap >(eventKey: T, arg: DrawEventArgMap[T]) {
    let callbacks = this._listeners.get(eventKey);
    if (Array.isArray(callbacks)) {
      callbacks.forEach((cb) => {
        cb(arg);
      });
      return true;
    } else {
      return false;
    }
  }

}