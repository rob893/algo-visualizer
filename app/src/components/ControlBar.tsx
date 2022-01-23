import { ArrowDropDown, ArrowDropUp, HelpOutline } from '@mui/icons-material';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import logo from '../logo.svg';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';

export interface ControlBarProps {
  onFindPath: Subject<{ speed: number; algo: PathFindingAlgorithm; cancelToken: { cancel: boolean } } | boolean>;
  onResetPath: Subject<void>;
  onResetBoard: Subject<void>;
}

let cancelToken = { cancel: false };

export default function ControlBar({ onFindPath, onResetPath, onResetBoard }: ControlBarProps): JSX.Element {
  const [speed, setSpeed] = useState(100);
  const [algo, setCurrAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [speedText, setSpeedText] = useState('Normal');
  const [algoText, setAlgoText] = useState("Dijkstra's");
  const [running, setRunning] = useState(false);

  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(speedMenuAnchorEl);

  const [algoMenuAnchorEl, setAlgoMenuAnchorEl] = useState<null | HTMLElement>(null);
  const algoMenuOpen = Boolean(algoMenuAnchorEl);

  const handleFindPath = (): void => {
    if (running) {
      cancelToken.cancel = true;
      setRunning(false);
    } else {
      setRunning(true);
      cancelToken = { cancel: false };
      onFindPath.next({ speed, algo, cancelToken });
    }
  };

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

  useEffect(() => {
    const pathSub = onFindPath.subscribe(event => {
      if (typeof event === 'boolean' && event) {
        setRunning(false);
      }
    });

    return () => {
      pathSub.unsubscribe();
    };
  });

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Stack direction="row" spacing={2} alignItems="center" display="flex" flexGrow={1}>
          <img src={logo} width={50} height={50} alt="logo" />
          <Typography variant="h5">Algo Visualizer</Typography>

          <Button
            sx={{ width: 150, height: 36.5 }}
            onClick={handleFindPath}
            variant="contained"
            color={running ? 'error' : 'success'}
          >
            {running ? 'Cancel' : 'Visualize Path!'}
          </Button>

          <Button
            onClick={e => setAlgoMenuAnchorEl(e.currentTarget)}
            endIcon={algoMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          >
            {algoText}
          </Button>
          <Menu open={algoMenuOpen} anchorEl={algoMenuAnchorEl} onClose={() => setAlgoMenuAnchorEl(null)}>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.Astar)}>A* Search</MenuItem>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.Dijkstra)}>Dijkstra's</MenuItem>
          </Menu>

          <Button
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

          <Button onClick={() => onResetBoard.next()}>Clear Board</Button>
          <Button onClick={() => onResetPath.next()}>Clear Path</Button>

          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Tooltip title="Help" sx={{ marginLeft: 'auto' }}>
              <IconButton>
                <HelpOutline color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
