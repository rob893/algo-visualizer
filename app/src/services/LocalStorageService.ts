import { LocalStorageKey } from '../models/enums';

export interface LocalStorageServiceOptions {
  environment?: string;
  prefix?: string;
}

export class LocalStorageService {
  private readonly storage: Storage;

  private readonly keyPrefix: string;

  private readonly cache = new Map<string, any>();

  public constructor(storage: Storage, options?: LocalStorageServiceOptions) {
    this.storage = storage;
    const { prefix, environment } = options ?? {};

    this.keyPrefix = '';

    if (prefix) {
      this.keyPrefix += `${prefix}-`;
    }

    if (environment) {
      this.keyPrefix += `${environment}-`;
    }
  }

  public getItem(key: LocalStorageKey): string | null {
    const computedKey = this.getKey(key);
    const fromCache = this.cache.get(computedKey);

    if (fromCache !== undefined) {
      return fromCache;
    }

    const item = this.storage.getItem(computedKey);

    if (!item) {
      return null;
    }

    this.cache.set(computedKey, item);

    return item;
  }

  public getParsedItem<T = unknown>(key: LocalStorageKey): T | null {
    const computedKey = this.getKey(key);
    const fromCache = this.cache.get(computedKey);

    if (fromCache !== undefined) {
      return fromCache;
    }

    const item = this.storage.getItem(computedKey);

    if (!item) {
      return null;
    }

    const parsed = JSON.parse(item);

    this.cache.set(computedKey, parsed);

    return parsed;
  }

  public setItem<T>(key: LocalStorageKey, value: T): void {
    const computedKey = this.getKey(key);

    if (typeof value === 'string') {
      this.storage.setItem(computedKey, value);
    } else {
      const asString = JSON.stringify(value);
      this.storage.setItem(computedKey, asString);
    }

    this.cache.set(computedKey, value);
  }

  public removeItem(key: LocalStorageKey): void {
    const computedKey = this.getKey(key);
    this.storage.removeItem(computedKey);
    this.cache.delete(computedKey);
  }

  public clear(): void {
    this.storage.clear();
    this.cache.clear();
  }

  private getKey(key: LocalStorageKey): string {
    return `${this.keyPrefix}${key}`;
  }
}

export const localStorageService = new LocalStorageService(localStorage, { prefix: 'algo-visualizer' });
