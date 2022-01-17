import { AppBar, Button, Toolbar } from '@mui/material';
import { useState } from 'react';
import { wasmService } from '../services/WasmService';
import { drawPath, getPoint } from '../utilities/utilities';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';

export interface ControlBarProps {
  handleReset: () => void;
  handleResetPath: () => void;
  start: string;
  end: string;
}

export default function ControlBar({ handleReset, handleResetPath, start, end }: ControlBarProps): JSX.Element {
  const [speed, setSpeed] = useState(100);
  const [currAlgo, setCurrAlgo] = useState(PathFindingAlgorithm.Dijkstra);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button onClick={handleReset}>Clear</Button>
        <Button onClick={handleResetPath}>Clear Path</Button>
        <Button onClick={() => drawPath(wasmService.universe, getPoint(start), getPoint(end), currAlgo, speed)}>
          Find Path!
        </Button>
        <Button onClick={() => setCurrAlgo(PathFindingAlgorithm.Dijkstra)}>Use Dijkstra's!</Button>
        <Button onClick={() => setCurrAlgo(PathFindingAlgorithm.Astar)}>Use A*!</Button>
        <Button onClick={() => setSpeed(200)}>Slow</Button>
        <Button onClick={() => setSpeed(100)}>Normal</Button>
        <Button onClick={() => setSpeed(50)}>Fast</Button>
      </Toolbar>
    </AppBar>
  );
}
