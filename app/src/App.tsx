import { AppBar, Box, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import './App.css';
import ControlBar from './components/ControlBar';
import GridNode from './components/GridNode';
import { inputService, MouseButton } from './services/InputService';
import { wasmService } from './services/WasmService';
import { drawPath, getKey, getPoint } from './utilities/utilities';
import { Node, PathFindingAlgorithm } from './wasm/algo_visualizer';

function App(): JSX.Element {
  const [start, setStart] = useState('0,0');
  const [end, setEnd] = useState('5,5');
  // let start = '0,0';
  // let end = '5,5';
  // let speed = 100;
  // let currAlgo = PathFindingAlgorithm.Dijkstra;
  const gridKeys: { nodeKey: string; className: string }[][] = [];

  for (let y = 0; y < 25; y++) {
    gridKeys.push([]);

    for (let x = 0; x < 55; x++) {
      const nodeKey = getKey(x, y);
      let className = '';

      if (nodeKey === start) {
        className = 'start';
      } else if (nodeKey === end) {
        className = 'end';
      }

      gridKeys[y].push({ nodeKey, className });
    }
  }

  function getIndex(x: number, y: number): number {
    return y * gridKeys[0].length + x;
  }

  const [grid, setGrid] = useState(gridKeys);

  function handleOnMouseEnter(_: string, node: Node): void {
    if (inputService.getMouseButton(MouseButton.LeftMouseButton)) {
      if (node.passable) {
        wasmService.universe.setPassable(node.x, node.y, false);
        const copy = [...grid];
        copy[node.y][node.x] = { ...copy[node.y][node.x], className: 'wall' };
        setGrid(copy);
      }
    }
  }

  function handleOnClick(_: string, node: Node): void {
    if (inputService.getKey('w')) {
      console.log('w pressed');
      wasmService.universe.setWeight(node.x, node.y, 15);
      wasmService.universe.setPassable(node.x, node.y, true);

      grid[node.y][node.x].className = 'heavy';
      setGrid(grid);
    } else if (inputService.getKey('s')) {
      const copy = [...grid];
      copy[node.y][node.x] = { ...copy[node.y][node.x], className: 'start' };
      setGrid(copy);
    } else if (inputService.getKey('e')) {
      console.log('e pressed');
      grid[node.y][node.x].className = 'end';
      setGrid(grid);
    } else {
      if (node.passable) {
        console.log('nothing pressed. Setting as wall');
        wasmService.universe.setPassable(node.x, node.y, false);
        const copy = [...grid];
        copy[node.y][node.x] = { ...copy[node.y][node.x], className: 'wall' };
        setGrid(copy);
      } else {
        console.log('nothing pressed. setting as nothing');
        wasmService.universe.setPassable(node.x, node.y, true);
        grid[node.y][node.x].className = '';
        setGrid(grid);
      }
    }
  }

  function handleReset(): void {
    wasmService.universe.reset();
    gridKeys.flat().forEach(({ nodeKey, className }) => {
      const ele = document.getElementById(nodeKey);

      if (ele) {
        ele.className = '';
      }
    });
  }

  function handleResetPath(): void {
    gridKeys.flat().forEach(({ nodeKey, className }) => {
      const ele = document.getElementById(nodeKey);

      if (ele && (ele.className === 'visited' || ele.className === 'path')) {
        ele.className = '';
      }
    });
  }

  //handleReset();

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
            {grid.map((row, y) => {
              return (
                <tr key={y}>
                  {row.map(({ nodeKey, className }) => {
                    // let className = '';

                    // if (nodeKey === start) {
                    //   className = 'start';
                    // } else if (nodeKey === end) {
                    //   className = 'end';
                    // }

                    return (
                      <GridNode
                        key={nodeKey}
                        nodeKey={nodeKey}
                        className={className}
                        onClick={handleOnClick}
                        onMouseEnter={handleOnMouseEnter}
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
