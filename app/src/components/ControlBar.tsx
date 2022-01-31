import {
  ArrowDropDown,
  ArrowDropUp,
  ClearAllOutlined,
  ClearOutlined,
  GitHub,
  HelpOutline,
  InfoOutlined,
  LegendToggleOutlined,
  PlayArrow,
  Stop
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import logo from '../logo.svg';
import { LocalStorageService } from '../services/LocalStorageService';
import { LocalStorageKey } from '../utilities/LocalStorageKey';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';
import AboutDialog from './AboutDialog';
import HelpDialog from './HelpDialog';
import Legend from './Legend';

export interface ControlBarProps {
  onFindPath: Subject<{ algo: PathFindingAlgorithm; context: { cancel: boolean; speed: number } } | boolean>;
  onResetPath: Subject<void>;
  onGenerateMaze: Subject<number>;
  onResetBoard: Subject<void>;
  localStorageService: LocalStorageService;
}

let context = { cancel: false, speed: 50 };

export default function ControlBar({
  onFindPath,
  onResetPath,
  onGenerateMaze,
  onResetBoard,
  localStorageService
}: ControlBarProps): JSX.Element {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const showHelpAtStartFromStorage = localStorageService.getItem(LocalStorageKey.ShowHelpAtStart);

  const [showAtStartChecked, setShowAtStartChecked] = useState(
    showHelpAtStartFromStorage === null || showHelpAtStartFromStorage === 'true'
  );
  const [speed, setSpeed] = useState(50);
  const [algo, setCurrAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [speedText, setSpeedText] = useState('Normal');
  const [algoText, setAlgoText] = useState("Dijkstra's");
  const [running, setRunning] = useState(false);
  const [openAboutDialog, setOpenAboutDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(
    showHelpAtStartFromStorage === null || showHelpAtStartFromStorage === 'true'
  );
  const [openLegend, setOpenLegend] = useState(false);

  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(speedMenuAnchorEl);

  const [algoMenuAnchorEl, setAlgoMenuAnchorEl] = useState<null | HTMLElement>(null);
  const algoMenuOpen = Boolean(algoMenuAnchorEl);

  const handleAboutClick = (): void => {
    setOpenAboutDialog(true);
  };

  const handleHelpClick = (): void => {
    setOpenHelpDialog(true);
  };

  const handleFindPath = (): void => {
    if (running) {
      context.cancel = true;
      setRunning(false);
    } else {
      setRunning(true);
      context = { cancel: false, speed };
      onFindPath.next({ algo, context });
    }
  };

  const handleAlgoChange = (newAlgo: PathFindingAlgorithm): void => {
    setCurrAlgo(newAlgo);
    setAlgoMenuAnchorEl(null);

    switch (newAlgo) {
      case PathFindingAlgorithm.Astar:
        setAlgoText('A* Search');
        break;
      case PathFindingAlgorithm.Dijkstra:
        setAlgoText("Dijkstra's");
        break;
      case PathFindingAlgorithm.BFS:
        setAlgoText('Breadth First');
        break;
      case PathFindingAlgorithm.DFS:
        setAlgoText('Depth First');
        break;
      default:
        setAlgoText("Dijkstra's");
        break;
    }
  };

  const handleSpeedChange = (newSpeed: number): void => {
    setSpeed(newSpeed);
    setSpeedMenuAnchorEl(null);
    context.speed = newSpeed;

    switch (newSpeed) {
      case 10:
        setSpeedText('Very Fast');
        break;
      case 25:
        setSpeedText('Fast');
        break;
      case 50:
        setSpeedText('Normal');
        break;
      case 100:
        setSpeedText('Slow');
        break;
      case 200:
        setSpeedText('Very Slow');
        break;
      default:
        setSpeedText('Normal');
        break;
    }
  };

  const handleHelpCheckbox = (checked: boolean): void => {
    localStorageService.setItem(LocalStorageKey.ShowHelpAtStart, `${checked}`);
    setShowAtStartChecked(checked);
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

  const desktopToolBar = (
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
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.BFS)}>Breadth First</MenuItem>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.DFS)}>Depth First</MenuItem>
          </Menu>

          <Button
            onClick={e => setSpeedMenuAnchorEl(e.currentTarget)}
            endIcon={speedMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          >
            Speed: {speedText}
          </Button>
          <Menu open={speedMenuOpen} anchorEl={speedMenuAnchorEl} onClose={() => setSpeedMenuAnchorEl(null)}>
            <MenuItem onClick={() => handleSpeedChange(200)}>Very Slow</MenuItem>
            <MenuItem onClick={() => handleSpeedChange(100)}>Slow</MenuItem>
            <MenuItem onClick={() => handleSpeedChange(50)}>Normal</MenuItem>
            <MenuItem onClick={() => handleSpeedChange(25)}>Fast</MenuItem>
            <MenuItem onClick={() => handleSpeedChange(10)}>Very Fast</MenuItem>
          </Menu>

          <Button onClick={() => onResetBoard.next()}>Clear Board</Button>
          <Button onClick={() => onResetPath.next()}>Clear Path</Button>
          <Button onClick={() => onGenerateMaze.next(0)}>Generate Walls</Button>
          <Button onClick={() => onGenerateMaze.next(1)}>Generate Weights</Button>

          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Tooltip title="About" sx={{ marginLeft: 'auto' }}>
              <IconButton onClick={handleAboutClick}>
                <InfoOutlined color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help">
              <IconButton onClick={handleHelpClick}>
                <HelpOutline color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Github">
              <IconButton href="https://github.com/rob893/algo-visualizer" target="_blank">
                <GitHub color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        <AboutDialog open={openAboutDialog} onClose={() => setOpenAboutDialog(false)} />
        <HelpDialog
          open={openHelpDialog}
          onClose={() => setOpenHelpDialog(false)}
          onShowHelpCheckboxChange={handleHelpCheckbox}
          showHelpAtStartChecked={showAtStartChecked}
        />
      </Toolbar>
    </AppBar>
  );

  const mobileToolBar = (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center" display="flex" flexGrow={1}>
            <img src={logo} width={40} height={40} alt="logo" />
            <Typography variant="h5">Algo Visualizer</Typography>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              <Tooltip title="About" sx={{ marginLeft: 'auto' }}>
                <IconButton onClick={handleAboutClick}>
                  <InfoOutlined color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Help">
                <IconButton onClick={handleHelpClick}>
                  <HelpOutline color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>

          <AboutDialog open={openAboutDialog} onClose={() => setOpenAboutDialog(false)} />
          <HelpDialog
            open={openHelpDialog}
            onClose={() => setOpenHelpDialog(false)}
            onShowHelpCheckboxChange={handleHelpCheckbox}
            showHelpAtStartChecked={showAtStartChecked}
          />
        </Toolbar>
      </AppBar>

      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton onClick={() => onResetBoard.next()} color="primary" aria-label="clear board">
            <ClearAllOutlined />
          </IconButton>

          <IconButton onClick={() => onResetPath.next()} color="primary" aria-label="clear path">
            <ClearOutlined />
          </IconButton>

          <Fab
            sx={{
              zIndex: 1,
              margin: '0 auto',
              top: -25,
              right: 0,
              left: 0,
              position: 'absolute',
              backgroundColor: running ? '#F44336' : '#4CAF50'
            }}
            onClick={handleFindPath}
          >
            {running ? <Stop /> : <PlayArrow />}
          </Fab>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={() => setOpenLegend(true)}>
            <LegendToggleOutlined color="primary" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Fragment>
  );

  return (
    <Fragment>
      {isDesktop ? desktopToolBar : mobileToolBar}
      <Legend isDesktop={isDesktop} open={openLegend} handleClose={() => setOpenLegend(false)} />
    </Fragment>
  );
}
