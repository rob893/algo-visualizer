import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { AppBar, Button, Menu, MenuItem, Toolbar } from '@mui/material';
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
  const [speedText, setSpeedText] = useState('Normal');
  const [algoText, setAlgoText] = useState("Dijkstra's");

  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(speedMenuAnchorEl);

  const [algoMenuAnchorEl, setAlgoMenuAnchorEl] = useState<null | HTMLElement>(null);
  const algoMenuOpen = Boolean(algoMenuAnchorEl);

  const handleAlgoChange = (newAlgo: PathFindingAlgorithm): void => {
    setCurrAlgo(newAlgo);
    setAlgoMenuAnchorEl(null);

    if (newAlgo === PathFindingAlgorithm.Astar) {
      setAlgoText('A* Search');
    } else {
      setAlgoText("Dijkstra's");
    }
  };

  const handleSpeedChange = (newSpeed: number): void => {
    setSpeed(newSpeed);
    setSpeedMenuAnchorEl(null);

    switch (newSpeed) {
      case 25:
        setSpeedText('Very Fast');
        break;
      case 50:
        setSpeedText('Fast');
        break;
      case 100:
        setSpeedText('Normal');
        break;
      case 200:
        setSpeedText('Slow');
        break;
      case 400:
        setSpeedText('Very Slow');
        break;
      default:
        setSpeedText('Normal');
        break;
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Button
          style={{ minWidth: 160, justifyContent: 'flex-start' }}
          onClick={e => setSpeedMenuAnchorEl(e.currentTarget)}
          endIcon={speedMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
        >
          Speed: {speedText}
        </Button>
        <Menu open={speedMenuOpen} anchorEl={speedMenuAnchorEl} onClose={() => setSpeedMenuAnchorEl(null)}>
          <MenuItem onClick={() => handleSpeedChange(400)}>Very Slow</MenuItem>
          <MenuItem onClick={() => handleSpeedChange(200)}>Slow</MenuItem>
          <MenuItem onClick={() => handleSpeedChange(100)}>Normal</MenuItem>
          <MenuItem onClick={() => handleSpeedChange(50)}>Fast</MenuItem>
          <MenuItem onClick={() => handleSpeedChange(25)}>Very Fast</MenuItem>
        </Menu>

        <Button
          style={{ minWidth: 120, justifyContent: 'flex-start' }}
          onClick={e => setAlgoMenuAnchorEl(e.currentTarget)}
          endIcon={algoMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
        >
          {algoText}
        </Button>
        <Menu open={algoMenuOpen} anchorEl={algoMenuAnchorEl} onClose={() => setAlgoMenuAnchorEl(null)}>
          <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.Astar)}>A* Search</MenuItem>
          <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.Dijkstra)}>Dijkstra's</MenuItem>
        </Menu>

        <Button onClick={() => onFindPath.next({ speed, algo })} variant="contained" color="success">
          Visualize Path!
        </Button>

        <Button onClick={() => onResetBoard.next()}>Clear</Button>
        <Button onClick={() => onResetPath.next()}>Clear Path</Button>
      </Toolbar>
    </AppBar>
  );
}
