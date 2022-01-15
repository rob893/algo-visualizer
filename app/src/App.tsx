import { AppBar, Box, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import './App.css';
import GridNode from './components/GridNode';
import { wasmService } from './services/WasmService';
import { getKey, getPoint, Point, wait } from './utilities/utilities';
import { PathFindingAlgorithm } from './wasm/algo_visualizer';

async function drawPath({ x: sx, y: sy }: Point, { x: ex, y: ey }: Point): Promise<void> {
  const t0 = performance.now();
  const res = wasmService.universe.findPath(sx, sy, ex, ey, PathFindingAlgorithm.Dijkstra);
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
  const gridKeys: string[][] = [];

  for (let y = 0; y < 25; y++) {
    gridKeys.push([]);

    for (let x = 0; x < 55; x++) {
      gridKeys[y].push(getKey(x, y));
    }
  }

  function handleReset(): void {
    wasmService.universe.reset();
    gridKeys.flat().forEach(nodeKey => {
      const ele = document.getElementById(nodeKey);

      if (ele) {
        ele.className = '';
      }
    });
  }

  handleReset();

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Button onClick={handleReset}>Clear</Button>
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
        </Toolbar>
      </AppBar>

      <Box paddingTop={2} display="flex" justifyContent="center">
        <table id="grid">
          <tbody>
            {gridKeys.map((row, y) => {
              return (
                <tr key={y}>
                  {row.map(nodeKey => {
                    let className = '';

                    if (nodeKey === start) {
                      className = 'start';
                    } else if (nodeKey === end) {
                      className = 'end';
                    }

                    return (
                      <GridNode
                        key={nodeKey}
                        nodeKey={nodeKey}
                        startKey={start}
                        endKey={end}
                        className={className}
                        onSetAsEnd={newEnd => {
                          end = newEnd;
                        }}
                        onSetAsStart={newStart => {
                          start = newStart;
                        }}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </div>
  );
}

export default App;
