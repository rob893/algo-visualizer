import init, { Universe } from '../wasm/algo_visualizer';

export class WasmService {
  private isInit = false;

  private universeObj?: Universe;

  private gWidth = 55;

  private gHeight = 25;

  public get universe(): Universe {
    this.assertInit();

    if (!this.universeObj) {
      this.universeObj = new Universe(this.gWidth, this.gHeight);
    }

    return this.universeObj;
  }

  public set gridWidth(value: number) {
    this.gWidth = value;
  }

  public set gridHeight(value: number) {
    this.gHeight = value;
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
