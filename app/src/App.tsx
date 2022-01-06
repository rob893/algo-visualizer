import logo from './logo.svg';
import './App.css';
import { Node, wasmService } from './services/WasmService';

wasmService.init();

async function wait(ms: number): Promise<void> {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

async function thing(): Promise<Node[]> {
  const ans: Node[] = [];

  const getKey = (x: number, y: number): any => {
    return `${x},${y}`;
  };

  const w = Infinity;
  const h = 1000;

  const grid = [
    [0, 0, w, 0, 0],
    [0, 0, w, 0, 0],
    [0, 0, w, 0, 0],
    [0, 0, h, 0, 0],
    [0, 0, 0, 0, 0]
  ];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const w = grid[y][x];
      ans.push({ id: getKey(x, y), x, y, passable: w !== Infinity, weight: w === Infinity ? 1000 : w });
    }
  }

  console.log(ans);

  const res = await wasmService.findPath(grid.length, grid[0].length, 0, 0, 4, 3, ans);

  for (const v of res.processed) {
    const ele = document.getElementById(v.id);

    if (ele) {
      ele.className = 'visited';
      await wait(250);
    }
  }

  for (const p of res.path) {
    const ele = document.getElementById(p.id);

    if (ele) {
      ele.className = 'path';
      await wait(250);
    }
  }

  console.log(res);

  //console.log(ans);

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

  const getKey = (x: number, y: number): any => {
    return `${x},${y}`;
  };

  const w = Infinity;
  const h = 1000;

  const grid = [
    [0, 0, w, 0, 0],
    [0, 0, w, 0, 0],
    [0, 0, w, 0, 0],
    [0, 0, h, 0, 0],
    [0, 0, 0, 0, 0]
  ];

  const nodeGrid: { element: JSX.Element; node: Node }[][] = [];

  for (let y = 0; y < grid.length; y++) {
    nodeGrid.push([]);
    for (let x = 0; x < grid[y].length; x++) {
      const w = grid[y][x];
      const element = <td key={getKey(x, y)} width="25px" height="25px" className="unvisited" id={getKey(x, y)}></td>;
      nodeGrid[y].push({
        element,
        node: { id: getKey(x, y), x, y, passable: w !== Infinity, weight: w === Infinity ? 1000 : w }
      });
    }
  }

  console.log(nodeGrid);

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

        <table id="grid">
          <tbody>
            {nodeGrid.map((row, y) => {
              return <tr key={y}>{row.map(({ element }) => element)}</tr>;
            })}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
