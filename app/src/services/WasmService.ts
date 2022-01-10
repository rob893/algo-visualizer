import init, { fib, test, sum, find_path as findPath } from '../wasm/algo_visualizer';

export interface Node {
  id: string;
  x: number;
  y: number;
  weight: number;
  passable: boolean;
}

export interface PathResult {
  path: Node[];
  processed: Node[];
}

export class WasmService {
  private isInit = false;

  public fib(n: number): number {
    this.assertInit();
    return fib(n);
  }

  public test(n: number[]): number[] {
    this.assertInit();
    return [...test(Int32Array.from(n))];
  }

  public sum(n: number[]): number {
    this.assertInit();
    return sum(Int32Array.from(n));
  }

  public findPath(startX: number, startY: number, endX: number, endY: number, nodes: Node[][]): PathResult {
    this.assertInit();

    const startTime = new Date().getTime();
    const res = findPath(startX, startY, endX, endY, nodes);
    console.log(`Path found in ${new Date().getTime() - startTime}ms!`);

    return res;
  }

  public async init(): Promise<void> {
    if (this.isInit) {
      console.log('WASM already ready!');
      return;
    }

    const start = new Date().getTime();
    await init();
    const end = new Date().getTime();

    this.isInit = true;
    console.log(`WASM is now ready in ${end - start}ms!`);
  }

  private assertInit(): void {
    if (!this.isInit) {
      throw new Error('WASM is not initialized! Please call init() before using wasm functions.');
    }
  }
}

export const wasmService = new WasmService();
