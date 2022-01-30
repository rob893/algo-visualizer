export enum MouseButton {
  LeftMouseButton = 0,
  MiddleMouseButton = 1,
  RightMouseButton = 2
}

export interface Listenable {
  addEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

export class InputService {
  private readonly keyDownMap = new Map<string, boolean>();

  private readonly mouseButtonDownMap = new Map<number, boolean>();

  private readonly element: Listenable;

  public constructor(element: Listenable) {
    this.element = element;
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

  public addEventListeners(): void {
    this.handleEvent = this.handleEvent.bind(this);

    this.element.addEventListener('keydown', this.handleEvent);
    this.element.addEventListener('keyup', this.handleEvent);
    this.element.addEventListener('mousedown', this.handleEvent);
    this.element.addEventListener('mouseup', this.handleEvent);
  }

  public removeEventListeners(): void {
    this.element.removeEventListener('keydown', this.handleEvent);
    this.element.removeEventListener('keyup', this.handleEvent);
    this.element.removeEventListener('mousedown', this.handleEvent);
    this.element.removeEventListener('mouseup', this.handleEvent);
  }

  private handleEvent(event: Event): void {
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

export const inputService = new InputService(document);
