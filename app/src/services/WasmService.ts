import init, { Universe } from '../wasm/algo_visualizer';

export class WasmService {
  private isInit = false;

  private universeObj?: Universe;

  private width = 55;

  private height = 25;

  public get universe(): Universe {
    this.assertInit();

    if (!this.universeObj) {
      this.universeObj = new Universe(this.width, this.height);
    }

    return this.universeObj;
  }

  public resize(width: number, height: number): Universe {
    this.width = width;
    this.height = height;

    this.universe.resize(width, height);

    return this.universe;
  }

  public async init(): Promise<void> {
    if (this.isInit) {
      console.log('WASM already ready!');
      return;
    }

    const start = performance.now();
    await init();
    const end = performance.now();

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
