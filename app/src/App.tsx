import logo from './logo.svg';
import './App.css';
import { Node, wasmService } from './services/WasmService';

wasmService.init();

async function thing(): Promise<Node[]> {
  const ans: Node[] = [];

  const getKey = (x: number, y: number): any => {
    return `${x},${y}`;
  };

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      ans.push({ id: getKey(i, j), x: j, y: i, passable: true, weight: 0 });
    }
  }

  const res = await wasmService.findPath(ans);

  console.log(res);

  console.log(ans);

  return ans;
}

function fibJS(n: number): number {
  if (n <= 2) {
    return 1;
  }

  return fibJS(n - 1) + fibJS(n - 2);
}

function sumJs(n: number[]): number {
  return n.reduce((a, b) => a + b);
}

function App(): JSX.Element {
  async function doFib(): Promise<void> {
    const fibNumber = 47;

    const jsStart = new Date().getTime();
    const fjs = fibJS(fibNumber);
    const jsEnd = new Date().getTime();
    console.log(`JS fib complete in ${(jsEnd - jsStart) / 1000} seconds: ${fjs}`);

    const wasmStart = new Date().getTime();
    const f = await wasmService.fib(fibNumber);
    const wasmEnd = new Date().getTime();
    console.log(`WASM fib complete in ${(wasmEnd - wasmStart) / 1000} seconds: ${f}`);
  }

  async function doTest(): Promise<void> {
    const f = await wasmService.test([1, 2, 3]);
    console.log(f);
  }

  async function doSum(): Promise<void> {
    const sumArr: number[] = [];
    for (let i = 0; i < 100000; i++) {
      sumArr.push(1);
    }

    const jsStart = new Date().getTime();
    const fjs = sumJs(sumArr);
    const jsEnd = new Date().getTime();
    console.log(`JS sum complete in ${(jsEnd - jsStart) / 1000} seconds: ${fjs}`);

    const wasmStart = new Date().getTime();
    const f = await wasmService.sum(sumArr);
    const wasmEnd = new Date().getTime();
    console.log(`WASM sum complete in ${(wasmEnd - wasmStart) / 1000} seconds: ${f}`);
  }

  // useEffect(() => {
  //   doFib().then(() => {
  //     doTest();
  //   });
  // });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={doTest}>Do Test</button>
        <button onClick={doFib}>Do Fib</button>
        <button onClick={doSum}>Do Sum</button>
        <button onClick={thing}>Do Thing</button>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
