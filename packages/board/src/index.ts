export default class IDrawBoard {
  private _container: HTMLElement;

  constructor(container: HTMLElement) {
    this._container = container;
  }

  public ready(): Promise<any> {
    this._container.innerText = 'hello @idraw/board';
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('ok!')
      }, 1000)
    })
  }
}