import Button from '@mui/material/Button';
import './App.css';
import { useKeyPress } from './hooks/useKeyPress';
import { wasmService } from './services/WasmService';
import { wait } from './utilities/utilities';

type Point = { x: number; y: number };

function getKey(x: number, y: number): string;
function getKey(node: Point): string;
function getKey(xOrNode: number | Point, y?: number): string {
  if (typeof xOrNode === 'number') {
    return `${xOrNode},${y}`;
  }

  return `${xOrNode.x},${xOrNode.y}`;
}

function getPoint(key: string): Point {
  const [x, y] = key.split(',');
  return { x: Number(x), y: Number(y) };
}

async function drawPath({ x: sx, y: sy }: Point, { x: ex, y: ey }: Point): Promise<void> {
  const t0 = performance.now();
  const res = wasmService.universe.findPath(sx, sy, ex, ey);
  console.log(`u path done in ${performance.now() - t0}ms!`);
  console.log(res);

  let prev: HTMLElement | null = null;

  for (const visitedNode of res.processed) {
    const ele = document.getElementById(getKey(visitedNode));

    if (ele) {
      if (ele.className !== 'start' && ele.className !== 'end') {
        ele.className = 'current';
      }

      await wait(100);

      prev = ele;

      if (prev.className !== 'start' && prev.className !== 'end') {
        prev.className = 'visited';
      }
    }
  }

  for (const pathNode of res.path) {
    const ele = document.getElementById(getKey(pathNode));

    if (ele) {
      if (ele.className !== 'start' && ele.className !== 'end') {
        ele.className = 'current';
      }

      await wait(100);

      prev = ele;

      if (prev.className !== 'start' && prev.className !== 'end') {
        prev.className = 'path';
      }
    }
  }
}

let start = '0,0';
let end = '5,5';

function App(): JSX.Element {
  const wPressed = useKeyPress('w');
  const sPressed = useKeyPress('s');
  const ePressed = useKeyPress('e');
  const aPressed = useKeyPress('a');

  const gridKeys: string[][] = [];

  for (let y = 0; y < 15; y++) {
    gridKeys.push([]);

    for (let x = 0; x < 35; x++) {
      gridKeys[y].push(getKey(x, y));
    }
  }

  return (
    <div>
      <header>
        <Button
          onClick={() => {
            wasmService.universe.reset();
            gridKeys.flat().forEach(nodeKey => {
              const ele = document.getElementById(nodeKey);

              if (ele) {
                ele.className = '';
              }
            });
          }}
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            gridKeys.flat().forEach(nodeKey => {
              const ele = document.getElementById(nodeKey);

              if (ele && (ele.className === 'visited' || ele.className === 'path')) {
                ele.className = '';
              }
            });
          }}
        >
          Clear Path
        </Button>
        <Button onClick={() => drawPath(getPoint(start), getPoint(end))}>Find Path!</Button>

        <table id="grid">
          <tbody>
            {gridKeys.map((row, y) => {
              return (
                <tr key={y}>
                  {row.map(nodeKey => {
                    const point = getPoint(nodeKey);
                    const nodeOuter = wasmService.universe.getCell(point.x, point.y);

                    let className = '';

                    if (nodeOuter.weight > 0) {
                      className = 'heavy';
                    }

                    if (nodeKey === start) {
                      className = 'start';
                    }

                    if (nodeKey === end) {
                      className = 'end';
                    }

                    if (!nodeOuter.passable) {
                      className = 'wall';
                    }

                    return (
                      <td
                        key={nodeKey}
                        width="25px"
                        height="25px"
                        className={className}
                        id={nodeKey}
                        onMouseEnter={() => {
                          if (aPressed) {
                            const point = getPoint(nodeKey);
                            const node = wasmService.universe.getCell(point.x, point.y);

                            const ele = document.getElementById(nodeKey);

                            if (!ele) {
                              throw new Error('Invalid node');
                            }

                            if (node.passable) {
                              wasmService.universe.setPassable(node.x, node.y, false);
                              ele.className = 'wall';
                            }
                          }
                        }}
                        onClick={() => {
                          const point = getPoint(nodeKey);
                          const node = wasmService.universe.getCell(point.x, point.y);

                          if (wPressed) {
                            wasmService.universe.setWeight(node.x, node.y, 15);
                            wasmService.universe.setPassable(node.x, node.y, true);

                            const ele = document.getElementById(nodeKey);

                            if (ele) {
                              ele.className = 'heavy';
                            }
                          } else if (sPressed) {
                            wasmService.universe.setWeight(node.x, node.y, 0);
                            wasmService.universe.setPassable(node.x, node.y, true);

                            const oldEle = document.getElementById(start);

                            if (oldEle) {
                              oldEle.className = 'unvisited';
                            }

                            const ele = document.getElementById(nodeKey);

                            if (ele) {
                              ele.className = 'start';
                            }

                            start = nodeKey;
                          } else if (ePressed) {
                            wasmService.universe.setWeight(node.x, node.y, 0);
                            wasmService.universe.setPassable(node.x, node.y, true);

                            const oldEle = document.getElementById(end);

                            if (oldEle) {
                              oldEle.className = 'unvisited';
                            }

                            const ele = document.getElementById(nodeKey);

                            if (ele) {
                              ele.className = 'end';
                            }

                            end = nodeKey;
                          } else {
                            const ele = document.getElementById(nodeKey);

                            if (!ele) {
                              throw new Error('Invalid node');
                            }

                            if (node.passable) {
                              wasmService.universe.setPassable(node.x, node.y, false);
                              ele.className = 'wall';
                            } else {
                              wasmService.universe.setPassable(node.x, node.y, true);
                              ele.className = 'unvisited';
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
