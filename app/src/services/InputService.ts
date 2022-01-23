export enum MouseButton {
  LeftMouseButton = 0,
  MiddleMouseButton = 1,
  RightMouseButton = 2
}

export class InputService {
  private readonly keyDownMap = new Map<string, boolean>();
  private readonly mouseButtonDownMap = new Map<number, boolean>();

  public constructor() {
    this.addEventListeners();
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

  public destroy(): void {
    this.removeEventListeners();
  }

  private addEventListeners(): void {
    this.handleEvent = this.handleEvent.bind(this);

    document.addEventListener('keydown', this.handleEvent);
    document.addEventListener('keyup', this.handleEvent);
    document.addEventListener('mousedown', this.handleEvent);
    document.addEventListener('mouseup', this.handleEvent);
  }

  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.handleEvent);
    document.removeEventListener('keyup', this.handleEvent);
    document.removeEventListener('mousedown', this.handleEvent);
    document.removeEventListener('mouseup', this.handleEvent);
  }

  private handleEvent(event: MouseEvent | KeyboardEvent): void {
    switch (event.type) {
      case 'keydown':
        this.keyDownMap.set((event as KeyboardEvent).key, true);
        break;
      case 'keyup':
        this.keyDownMap.set((event as KeyboardEvent).key, false);
        break;
      case 'mousedown':
        this.mouseButtonDownMap.set((event as MouseEvent).button, true);
        break;
      case 'mouseup':
        this.mouseButtonDownMap.set((event as MouseEvent).button, false);
        break;
      default:
        break;
    }
  }
}

export const inputService = new InputService();
