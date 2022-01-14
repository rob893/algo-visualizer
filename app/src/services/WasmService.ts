import init, { Universe } from '../wasm/algo_visualizer';

export class WasmService {
  private isInit = false;
  private universeObj?: Universe;

  public get universe(): Universe {
    this.assertInit();

    if (!this.universeObj) {
      this.universeObj = new Universe(55, 25);
    }

    return this.universeObj;
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
