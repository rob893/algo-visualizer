import init, { fib, test, sum } from '../wasm/algo_visualizer';

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

  private async init(): Promise<void> {
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
