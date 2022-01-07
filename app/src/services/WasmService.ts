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

  public async fib(n: number): Promise<number> {
    await this.init();
    return fib(n);
  }

  public async test(n: number[]): Promise<number[]> {
    await this.init();
    return [...test(Int32Array.from(n))];
  }

  public async sum(n: number[]): Promise<number> {
    await this.init();
    return sum(Int32Array.from(n));
  }

  public async findPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    nodes: Node[][]
  ): Promise<PathResult> {
    const startTime = new Date().getTime();
    await this.init();
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
}

export const wasmService = new WasmService();
