import { AppBar, Box, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import './App.css';
import ControlBar from './components/ControlBar';
import GridNode from './components/GridNode';
import { wasmService } from './services/WasmService';
import { drawPath, getKey, getPoint } from './utilities/utilities';
import { PathFindingAlgorithm } from './wasm/algo_visualizer';

function App(): JSX.Element {
  const [start, setStart] = useState('0,0');
  const [end, setEnd] = useState('5,5');
  // let start = '0,0';
  // let end = '5,5';
  // let speed = 100;
  // let currAlgo = PathFindingAlgorithm.Dijkstra;
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

  function handleResetPath(): void {
    gridKeys.flat().forEach(nodeKey => {
      const ele = document.getElementById(nodeKey);

      if (ele && (ele.className === 'visited' || ele.className === 'path')) {
        ele.className = '';
      }
    });
  }

  handleReset();

  return (
    <div>
      <ControlBar handleReset={handleReset} handleResetPath={handleResetPath} start={start} end={end} />
      {/* <AppBar position="sticky">
        <Toolbar>
          <Button onClick={handleReset}>Clear</Button>
          <Button onClick={handleResetPath}>Clear Path</Button>
          <Button onClick={() => drawPath(wasmService.universe, getPoint(start), getPoint(end), currAlgo, speed)}>
            Find Path!
          </Button>
          <Button onClick={() => (currAlgo = PathFindingAlgorithm.Dijkstra)}>Use Dijkstra's!</Button>
          <Button onClick={() => (currAlgo = PathFindingAlgorithm.Astar)}>Use A*!</Button>
          <Button onClick={() => (speed = 200)}>Slow</Button>
          <Button onClick={() => (speed = 100)}>Normal</Button>
          <Button onClick={() => (speed = 50)}>Fast</Button>
        </Toolbar>
      </AppBar> */}

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
                        onSetAsEnd={setEnd}
                        onSetAsStart={setStart}
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
