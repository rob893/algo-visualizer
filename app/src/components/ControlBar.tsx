import { AppBar, Button, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Subject } from 'rxjs';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';

export interface ControlBarProps {
  onFindPath: Subject<{ speed: number; algo: PathFindingAlgorithm }>;
  onResetPath: Subject<void>;
  onResetBoard: Subject<void>;
}

export default function ControlBar({ onFindPath, onResetPath, onResetBoard }: ControlBarProps): JSX.Element {
  const [speed, setSpeed] = useState(100);
  const [algo, setCurrAlgo] = useState(PathFindingAlgorithm.Dijkstra);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button onClick={() => onResetBoard.next()}>Clear</Button>
        <Button onClick={() => onResetPath.next()}>Clear Path</Button>
        <Button onClick={() => onFindPath.next({ speed, algo })}>Find Path!</Button>
        <Button onClick={() => setCurrAlgo(PathFindingAlgorithm.Dijkstra)}>Use Dijkstra's!</Button>
        <Button onClick={() => setCurrAlgo(PathFindingAlgorithm.Astar)}>Use A*!</Button>
        <Button onClick={() => setSpeed(200)}>Slow</Button>
        <Button onClick={() => setSpeed(100)}>Normal</Button>
        <Button onClick={() => setSpeed(50)}>Fast</Button>
      </Toolbar>
    </AppBar>
  );
}
