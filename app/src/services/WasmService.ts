import init, { fib, test, sum, find_path as findPath } from '../wasm/algo_visualizer';

// pub id: String,
//     pub x: u32,
//     pub y: u32,
//     pub weight: u32,
//     pub passable: bool,

export interface Node {
  id: string;
  x: number;
  y: number;
  weight: number;
  passable: boolean;
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

  public async findPath(n: Node[]): Promise<[string[], string[]]> {
    await this.init();
    return findPath(3, 3, n);
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
