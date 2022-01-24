import { LocalStorageKey } from '../utilities/LocalStorageKey';

export class LocalStorageService {
  private readonly storage: Storage;

  private readonly cache = new Map<LocalStorageKey, any>();

  public constructor(storage: Storage) {
    this.storage = storage;
  }

  public getItem(key: LocalStorageKey): string | null {
    const fromCache = this.cache.get(key);

    if (fromCache !== undefined) {
      return fromCache;
    }

    const item = this.storage.getItem(key);

    if (!item) {
      return null;
    }

    this.cache.set(key, item);

    return item;
  }

  public getParsedItem<T = unknown>(key: LocalStorageKey): T | null {
    const fromCache = this.cache.get(key);

    if (fromCache !== undefined) {
      return fromCache;
    }

    const item = this.getItem(key);

    if (!item) {
      return null;
    }

    const parsed = JSON.parse(item);

    this.cache.set(key, parsed);

    return parsed;
  }

  public setItem<T>(key: LocalStorageKey, value: T): void {
    if (typeof value === 'string') {
      this.storage.setItem(key, value);
    } else {
      const asString = JSON.stringify(value);
      this.storage.setItem(key, asString);
    }

    this.cache.set(key, value);
  }

  public removeItem(key: LocalStorageKey): void {
    this.storage.removeItem(key);
    this.cache.delete(key);
  }

  public clear(): void {
    this.storage.clear();
    this.cache.clear();
  }
}

export const localStorageService = new LocalStorageService(localStorage);
