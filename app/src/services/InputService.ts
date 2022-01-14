export enum MouseButton {
  LeftMouseButton = 0,
  MiddleMouseButton = 1,
  RightMouseButton = 2
}

export class InputService {
  private readonly keyDownMap = new Map<string, boolean>();
  private readonly mouseButtonDownMap = new Map<number, boolean>();

  public constructor() {
    document.addEventListener('keydown', e => {
      this.keyDownMap.set(e.key, true);
    });
    document.addEventListener('keyup', e => {
      this.keyDownMap.set(e.key, false);
    });
    document.addEventListener('mousedown', e => {
      this.mouseButtonDownMap.set(e.button, true);
    });
    document.addEventListener('mouseup', e => {
      this.mouseButtonDownMap.set(e.button, false);
    });
  }

  /**
   * This function will return true if the passed in key is currently being pressed.
   *
   * @param key The key to check if it is currently being pressed.
   * @example if (Input.getKey('j)) { console.log('J is being pressed'); }
   */
  public getKey(key: string): boolean {
    return this.keyDownMap.get(key) ?? false;
  }

  public getMouseButton(mouseButton: 0 | 1 | 2 | MouseButton): boolean {
    return this.mouseButtonDownMap.get(mouseButton) ?? false;
  }
}

export const inputService = new InputService();
