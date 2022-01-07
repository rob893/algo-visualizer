import './App.css';
import { useState, useEffect } from 'react';
import { Node, wasmService } from './services/WasmService';

wasmService.init();

function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }: KeyboardEvent): void => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ key }: KeyboardEvent): void => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });

  return keyPressed;
}

async function wait(ms: number): Promise<void> {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

async function thing({ x: sx, y: sy }: Node, { x: ex, y: ey }: Node, grid: Node[][]): Promise<Node[]> {
  const res = await wasmService.findPath(sx, sy, ex, ey, grid);

  for (const v of res.processed) {
    const ele = document.getElementById(v.id);

    if (ele) {
      ele.className = 'visited';
      await wait(100);
    }
  }

  for (const p of res.path) {
    const ele = document.getElementById(p.id);

    if (ele) {
      ele.className = 'path';
      await wait(150);
    }
  }

  console.log(res);

  //console.log(ans);

  return [];
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

const getKey = (x: number, y: number): any => {
  return `${x},${y}`;
};

const nodeGrid: Node[][] = [];
const nodeLookup = new Map<string, Node>();

for (let y = 0; y < 15; y++) {
  nodeGrid.push([]);
  for (let x = 0; x < 35; x++) {
    const node = { id: getKey(x, y), x, y, passable: true, weight: 0 };
    nodeLookup.set(node.id, node);

    nodeGrid[y].push(node);
  }
}

let start = nodeGrid[0][0];
let end = nodeGrid[5][5];

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

  const wPressed = useKeyPress('w');
  const sPressed = useKeyPress('s');
  const ePressed = useKeyPress('e');

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={doTest}>Do Test</button>
        <button onClick={doFib}>Do Fib</button>
        <button onClick={doSum}>Do Sum</button>
        <button
          onClick={() => {
            nodeGrid.flat().forEach(node => {
              node.passable = true;
              node.weight = 0;
              const ele = document.getElementById(node.id);

              if (ele) {
                ele.className = 'unvisited';
              }
            });
          }}
        >
          Clear
        </button>
        <button onClick={() => thing(start, end, nodeGrid)}>Do Thing</button>

        <table id="grid">
          <tbody>
            {nodeGrid.map((row, y) => {
              return (
                <tr key={y}>
                  {row.map(node => {
                    let className = 'unvisited';

                    if (node.weight > 0) {
                      className = 'heavy';
                    }

                    if (node === start) {
                      className = 'start';
                    }

                    if (node === end) {
                      className = 'end';
                    }

                    if (!node.passable) {
                      className = 'wall';
                    }

                    return (
                      <td
                        key={getKey(node.x, node.y)}
                        width="25px"
                        height="25px"
                        className={className}
                        id={getKey(node.x, node.y)}
                        onClick={() => {
                          if (wPressed) {
                            node.passable = true;
                            node.weight = 15;
                            const ele = document.getElementById(node.id);

                            if (ele) {
                              ele.className = 'heavy';
                            }
                          } else if (sPressed) {
                            node.passable = true;
                            node.weight = 0;
                            const oldEle = document.getElementById(start.id);

                            if (oldEle) {
                              oldEle.className = 'unvisited';
                            }

                            const ele = document.getElementById(node.id);

                            if (ele) {
                              ele.className = 'start';
                            }

                            start = node;
                          } else if (ePressed) {
                            node.passable = true;
                            node.weight = 0;
                            const oldEle = document.getElementById(end.id);

                            if (oldEle) {
                              oldEle.className = 'unvisited';
                            }

                            const ele = document.getElementById(node.id);

                            if (ele) {
                              ele.className = 'end';
                            }

                            end = node;
                          } else {
                            node.passable = false;
                            const ele = document.getElementById(node.id);

                            if (ele) {
                              ele.className = 'wall';
                            }
                          }
                        }}
                      ></td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
