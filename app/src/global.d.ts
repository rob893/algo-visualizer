/* eslint-disable @typescript-eslint/no-empty-interface */
import { IEnumerable } from 'typescript-extended-linq';

declare global {
  interface Array<T> extends Omit<IEnumerable<T>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Int8Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Int16Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Int32Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Uint8ClampedArray extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Uint16Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Uint32Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Float32Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Float64Array extends Omit<IEnumerable<number>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Map<K, V> extends Omit<IEnumerable<[K, V]>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface Set<T> extends Omit<IEnumerable<T>, 'forEach' | 'toString' | 'toJSON' | symbol> {}
  interface String
    extends Omit<IEnumerable<string>, 'endsWith' | 'startsWith' | 'split' | 'toString' | 'toJSON' | symbol> {}
}
