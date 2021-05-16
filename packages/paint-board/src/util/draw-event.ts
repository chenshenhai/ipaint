import { TypeDataPosition } from '@idraw/paint-types'

export interface TypeDrawEventArgMap {
  'draw': TypeDataPosition;
  "drawStart": TypeDataPosition;
  "drawEnd": TypeDataPosition;
}

export interface TypeDrawEvent {
  on<T extends keyof TypeDrawEventArgMap >(key: T, callback: (p: TypeDrawEventArgMap[T]) => any): void
  off<T extends keyof TypeDrawEventArgMap >(key: T, callback: (p: TypeDrawEventArgMap[T]) => any): void
  trigger<T extends keyof TypeDrawEventArgMap >(key: T, p: TypeDrawEventArgMap[T]): void
}


export class DrawEvent implements TypeDrawEvent {

  private _listeners: Map<string, Function[]>;

  constructor() {
    this._listeners = new Map();
  }

  on<T extends keyof TypeDrawEventArgMap >(eventKey: T, callback: (p: TypeDrawEventArgMap[T]) => any) {
    if (this._listeners.has(eventKey)) {
      const callbacks = this._listeners.get(eventKey);
      callbacks?.push(callback);
      this._listeners.set(eventKey, callbacks || [])
    } else {
      this._listeners.set(eventKey, [callback]);
    }
  }
  
  off<T extends keyof TypeDrawEventArgMap >(eventKey: T, callback: (p: TypeDrawEventArgMap[T]) => any) {
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

  trigger<T extends keyof TypeDrawEventArgMap >(eventKey: T, arg: TypeDrawEventArgMap[T]) {
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

  has(name: string) {
    if (this._listeners.has(name)) {
      const list: Function[] | undefined = this._listeners.get(name);
      if (Array.isArray(list) && list.length > 0) {
        return true;
      }
    }
    return false;
  }

}