import {
  ArrowDropDown,
  ArrowDropUp,
  ClearAllOutlined,
  ClearOutlined,
  GitHub,
  HelpOutline,
  InfoOutlined,
  LegendToggleOutlined,
  MoreVert,
  PlayArrow,
  Settings,
  Stop
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Fab,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import logo from '../logo.svg';
import { NodeContextSelection, AnimationSpeed, PlayType } from '../models/enums';
import { LocalStorageService } from '../services/LocalStorageService';
import { LocalStorageKey } from '../models/enums';
import { getSpeedText, getAlgoNameText, getMazeTypeText } from '../utilities/utilities';
import { MazeType, PathFindingAlgorithm } from '../wasm/algo_visualizer';
import AboutDialog from './AboutDialog';
import HelpDialog from './HelpDialog';
import Legend from './Legend';
import SettingsDialog from './SettingsDialog';
import { green, red } from '@mui/material/colors';
import { PlayContext } from '../models/models';

export interface ControlBarProps {
  onFindPath: Subject<{ algo: PathFindingAlgorithm; context: PlayContext } | boolean>;
  onResetPath: Subject<void>;
  onGenerateMaze: Subject<{ playType: PlayType; mazeType: MazeType; context: PlayContext }>;
  onResetBoard: Subject<void>;
  onSelectionChange: Subject<NodeContextSelection>;
  localStorageService: LocalStorageService;
}

let context = { cancel: false, speed: 50 };

export default function ControlBar({
  onFindPath,
  onResetPath,
  onGenerateMaze,
  onResetBoard,
  onSelectionChange,
  localStorageService
}: ControlBarProps): JSX.Element {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const showHelpAtStartFromStorage = localStorageService.getItem(LocalStorageKey.ShowHelpAtStart);

  const [showAtStartChecked, setShowAtStartChecked] = useState(
    showHelpAtStartFromStorage === null || showHelpAtStartFromStorage === 'true'
  );
  const [speed, setSpeed] = useState(AnimationSpeed.Normal);
  const [algo, setCurrAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [speedText, setSpeedText] = useState(getSpeedText(AnimationSpeed.Normal));
  const [algoText, setAlgoText] = useState(getAlgoNameText(PathFindingAlgorithm.Dijkstra));
  const [mazeType, setMazeType] = useState(MazeType.RecursiveDivision);
  const [mazeTypeText, setMazeTypeText] = useState(getMazeTypeText(mazeType));
  const [running, setRunning] = useState(false);
  const [openAboutDialog, setOpenAboutDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(
    showHelpAtStartFromStorage === null || showHelpAtStartFromStorage === 'true'
  );
  const [openLegend, setOpenLegend] = useState(false);
  const [playType, setPlayType] = useState(PlayType.Path);

  const [speedMenuAnchorEl, setSpeedMenuAnchorEl] = useState<null | HTMLElement>(null);
  const speedMenuOpen = Boolean(speedMenuAnchorEl);

  const [algoMenuAnchorEl, setAlgoMenuAnchorEl] = useState<null | HTMLElement>(null);
  const algoMenuOpen = Boolean(algoMenuAnchorEl);

  const [mazeMenuAnchorEl, setMazeMenuAnchorEl] = useState<null | HTMLElement>(null);
  const mazeMenuOpen = Boolean(mazeMenuAnchorEl);

  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const [selection, setSelection] = useState(NodeContextSelection.Wall);

  const selections = ['Wall', 'Heavy', 'Start', 'End'];

  const handleAboutClick = (): void => {
    setOpenAboutDialog(true);
  };

  const handleHelpClick = (): void => {
    setOpenHelpDialog(true);
  };

  const handlePlay = (): void => {
    if (running) {
      context.cancel = true;
      setRunning(false);
    } else {
      setRunning(true);
      context = { cancel: false, speed };

      switch (playType) {
        case PlayType.Path:
          onFindPath.next({ algo, context });
          break;
        case PlayType.Wall:
          onGenerateMaze.next({ playType: PlayType.Wall, mazeType, context });
          break;
        case PlayType.Heavy:
          onGenerateMaze.next({ playType: PlayType.Heavy, mazeType, context });
          break;
        default:
          onFindPath.next({ algo, context });
          break;
      }
    }
  };

  const handleAlgoChange = (newAlgo: PathFindingAlgorithm): void => {
    setCurrAlgo(newAlgo);
    setAlgoMenuAnchorEl(null);
    setAlgoText(getAlgoNameText(newAlgo));
  };

  const handleMazeTypeChange = (newMazeType: MazeType): void => {
    setMazeType(newMazeType);
    setMazeMenuAnchorEl(null);
    setMazeTypeText(getMazeTypeText(newMazeType));
  };

  const handlePlayTypeChange = (newPlayType: PlayType): void => {
    setPlayType(newPlayType);
  };

  const handleSpeedChange = (newSpeed: AnimationSpeed): void => {
    setSpeed(newSpeed);
    setSpeedMenuAnchorEl(null);
    context.speed = newSpeed;
    setSpeedText(getSpeedText(newSpeed));
  };

  const handleSelection = (): void => {
    const newSelection = (selection + 1) % selections.length;
    onSelectionChange.next(newSelection);
    setSelection(newSelection);
  };

  const getPlayButtonText = (): string => {
    switch (playType) {
      case PlayType.Path:
        return 'Visualize Path!';
      case PlayType.Wall:
        return 'Draw Walls!';
      case PlayType.Heavy:
        return 'Draw Weights!';
      default:
        return 'Visualize Path!';
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
            onClick={handlePlay}
            variant="contained"
            color={running ? 'error' : 'success'}
          >
            {running ? 'Cancel' : getPlayButtonText()}
          </Button>

          <ToggleButtonGroup
            color="primary"
            value={playType}
            size="small"
            exclusive
            onChange={(_, type) => handlePlayTypeChange(type)}
          >
            <ToggleButton value={PlayType.Path}>Path</ToggleButton>
            <ToggleButton value={PlayType.Wall}>Walls</ToggleButton>
            <ToggleButton value={PlayType.Heavy}>Weights</ToggleButton>
          </ToggleButtonGroup>

          <Button
            onClick={e => setSpeedMenuAnchorEl(e.currentTarget)}
            endIcon={speedMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          >
            Speed: {speedText}
          </Button>
          <Menu open={speedMenuOpen} anchorEl={speedMenuAnchorEl} onClose={() => setSpeedMenuAnchorEl(null)}>
            <MenuItem onClick={() => handleSpeedChange(AnimationSpeed.VerySlow)}>
              {getSpeedText(AnimationSpeed.VerySlow)}
            </MenuItem>
            <MenuItem onClick={() => handleSpeedChange(AnimationSpeed.Slow)}>
              {getSpeedText(AnimationSpeed.Slow)}
            </MenuItem>
            <MenuItem onClick={() => handleSpeedChange(AnimationSpeed.Normal)}>
              {getSpeedText(AnimationSpeed.Normal)}
            </MenuItem>
            <MenuItem onClick={() => handleSpeedChange(AnimationSpeed.Fast)}>
              {getSpeedText(AnimationSpeed.Fast)}
            </MenuItem>
            <MenuItem onClick={() => handleSpeedChange(AnimationSpeed.VeryFast)}>
              {getSpeedText(AnimationSpeed.VeryFast)}
            </MenuItem>
          </Menu>

          <Button
            disabled={running}
            onClick={e => setAlgoMenuAnchorEl(e.currentTarget)}
            endIcon={algoMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          >
            {algoText}
          </Button>
          <Menu open={algoMenuOpen} anchorEl={algoMenuAnchorEl} onClose={() => setAlgoMenuAnchorEl(null)}>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.Dijkstra)}>
              {getAlgoNameText(PathFindingAlgorithm.Dijkstra)}
            </MenuItem>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.Astar)}>
              {getAlgoNameText(PathFindingAlgorithm.Astar)}
            </MenuItem>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.GreedyBFS)}>
              {getAlgoNameText(PathFindingAlgorithm.GreedyBFS)}
            </MenuItem>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.BFS)}>
              {getAlgoNameText(PathFindingAlgorithm.BFS)}
            </MenuItem>
            <MenuItem onClick={() => handleAlgoChange(PathFindingAlgorithm.DFS)}>
              {getAlgoNameText(PathFindingAlgorithm.DFS)}
            </MenuItem>
          </Menu>

          <Button
            disabled={running}
            onClick={e => setMazeMenuAnchorEl(e.currentTarget)}
            endIcon={mazeMenuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
          >
            {mazeTypeText}
          </Button>
          <Menu open={mazeMenuOpen} anchorEl={mazeMenuAnchorEl} onClose={() => setMazeMenuAnchorEl(null)}>
            <MenuItem onClick={() => handleMazeTypeChange(MazeType.RecursiveDivision)}>
              {getMazeTypeText(MazeType.RecursiveDivision)}
            </MenuItem>
            <MenuItem onClick={() => handleMazeTypeChange(MazeType.Random25)}>
              {getMazeTypeText(MazeType.Random25)}
            </MenuItem>
            <MenuItem onClick={() => handleMazeTypeChange(MazeType.Random50)}>
              {getMazeTypeText(MazeType.Random50)}
            </MenuItem>
            <MenuItem onClick={() => handleMazeTypeChange(MazeType.Random75)}>
              {getMazeTypeText(MazeType.Random75)}
            </MenuItem>
          </Menu>

          <Button disabled={running} onClick={() => onResetBoard.next()}>
            Clear Board
          </Button>
          <Button disabled={running} onClick={() => onResetPath.next()}>
            Clear Path
          </Button>

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
              <IconButton href="https://github.com/rob893/algo-visualizer" target="_blank" rel="noopener">
                <GitHub color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        <AboutDialog open={openAboutDialog} onClose={() => setOpenAboutDialog(false)} />
        <HelpDialog
          open={openHelpDialog}
          isDesktop={isDesktop}
          onClose={() => setOpenHelpDialog(false)}
          onShowHelpCheckboxChange={handleHelpCheckbox}
          showHelpAtStartChecked={showAtStartChecked}
        />
      </Toolbar>
    </AppBar>
  );

  const mobileToolBar = (
    <Fragment>
      <AppBar position="sticky" sx={{ marginBottom: 2 }}>
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center" display="flex" flexGrow={1}>
            <img src={logo} width={40} height={40} alt="logo" />
            <Typography variant="h5">Algo Visualizer</Typography>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              <Tooltip title="Settings" sx={{ marginLeft: 'auto' }}>
                <IconButton onClick={() => setOpenSettingsDialog(true)}>
                  <Settings color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title="More">
                <IconButton onClick={e => setMoreMenuAnchorEl(e.currentTarget)}>
                  <MoreVert color="primary" />
                </IconButton>
              </Tooltip>
              <Menu open={moreMenuOpen} anchorEl={moreMenuAnchorEl} onClose={() => setMoreMenuAnchorEl(null)}>
                <MenuItem onClick={handleAboutClick}>
                  <ListItemIcon>
                    <InfoOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>About</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleHelpClick}>
                  <ListItemIcon>
                    <HelpOutline fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Help</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setOpenLegend(true)}>
                  <ListItemIcon>
                    <LegendToggleOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Legend</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => setOpenSettingsDialog(true)}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <Link
                  href="https://github.com/rob893/algo-visualizer"
                  target="_blank"
                  rel="noopener"
                  color="inherit"
                  sx={{ textDecoration: 'none', outline: 'none' }}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <GitHub fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Github</ListItemText>
                  </MenuItem>
                </Link>
              </Menu>
            </Box>
          </Stack>

          <AboutDialog open={openAboutDialog} onClose={() => setOpenAboutDialog(false)} />
          <HelpDialog
            open={openHelpDialog}
            isDesktop={isDesktop}
            onClose={() => setOpenHelpDialog(false)}
            onShowHelpCheckboxChange={handleHelpCheckbox}
            showHelpAtStartChecked={showAtStartChecked}
          />
          <SettingsDialog
            open={openSettingsDialog}
            onClose={() => setOpenSettingsDialog(false)}
            onAlgoChosen={handleAlgoChange}
            onSpeedChosen={handleSpeedChange}
            onPlayTypeChosen={handlePlayTypeChange}
            onMazeTypeChosen={handleMazeTypeChange}
          />
        </Toolbar>
      </AppBar>

      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton disabled={running} onClick={() => onResetBoard.next()} color="primary" aria-label="clear board">
            <ClearAllOutlined />
          </IconButton>

          <IconButton disabled={running} onClick={() => onResetPath.next()} color="primary" aria-label="clear path">
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
              backgroundColor: running ? red[500] : green[500],
              '&:hover': {
                backgroundColor: running ? red[700] : green[700]
              }
            }}
            onClick={handlePlay}
            disableFocusRipple={true}
          >
            {running ? <Stop /> : <PlayArrow />}
          </Fab>

          <Box sx={{ flexGrow: 1 }} />

          <Button onClick={handleSelection}>{selections[selection]}</Button>

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
