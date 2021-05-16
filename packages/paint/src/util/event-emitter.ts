
export default class EventEmitter {

  private _listeners: Map<string, Function[]>;

  constructor() {
    this._listeners = new Map();
  }

  on(eventKey: string, callback: Function) {
    if (this._listeners.has(eventKey)) {
      const callbacks = this._listeners.get(eventKey);
      callbacks?.push(callback);
      this._listeners.set(eventKey, callbacks || [])
    } else {
      this._listeners.set(eventKey, [callback]);
    }
  }
  
  off(eventKey: string, callback: Function) {
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

  trigger(eventKey: string, ...args: any[]) {
    let callbacks = this._listeners.get(eventKey);
    if (Array.isArray(callbacks)) {
      callbacks.forEach((cb) => {
        cb(...args);
      });
      return true;
    } else {
      return false;
    }
  }

}