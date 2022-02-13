import {
  ClearAllOutlined,
  ClearOutlined,
  FormatColorFill,
  GitHub,
  HelpOutline,
  History,
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
import { MazeType, PathFindingAlgorithm } from '../wasm/algo_visualizer';
import AboutDialog from './AboutDialog';
import HelpDialog from './HelpDialog';
import Legend from './Legend';
import SettingsDialog from './SettingsDialog';
import { green, red } from '@mui/material/colors';
import { PathFindingAlgorithmRun, PlayContext } from '../models/models';
import ColorPicker from './ColorPicker';
import { getAlgoNameText } from '../utilities/utilities';
import { isPathFindingAlgorithmRun } from '../utilities/typeguards';
import RunHistoryDialog from './RunHistoryDialog';

export interface ControlBarProps {
  onFindPath: Subject<{ algo: PathFindingAlgorithm; context: PlayContext } | PathFindingAlgorithmRun | boolean>;
  onResetPath: Subject<void>;
  onWeightChange: Subject<number>;
  onGenerateMaze: Subject<{ playType: PlayType; mazeType: MazeType; context: PlayContext }>;
  onResetBoard: Subject<void>;
  onRestoreRunHistory: Subject<PathFindingAlgorithmRun>;
  onSelectionChange: Subject<NodeContextSelection>;
  localStorageService: LocalStorageService;
}

let context = { cancel: false, speed: 50 };

export default function ControlBar({
  onFindPath,
  onResetPath,
  onGenerateMaze,
  onWeightChange,
  onRestoreRunHistory,
  onResetBoard,
  onSelectionChange,
  localStorageService
}: ControlBarProps): JSX.Element {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [showAtStartChecked, setShowAtStartChecked] = useState(() => {
    const showHelpAtStartFromStorage = localStorageService.getItem(LocalStorageKey.ShowHelpAtStart);
    return showHelpAtStartFromStorage === null || showHelpAtStartFromStorage === 'true';
  });
  const [speed, setSpeed] = useState(AnimationSpeed.Normal);
  const [algo, setCurrAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [mazeType, setMazeType] = useState(MazeType.RecursiveDivision);
  const [running, setRunning] = useState(false);
  const [openAboutDialog, setOpenAboutDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(showAtStartChecked);
  const [openLegend, setOpenLegend] = useState(false);
  const [playType, setPlayType] = useState(PlayType.Path);
  const [runHistory, setRunHistory] = useState<PathFindingAlgorithmRun[]>(() => {
    const runHistoryFromStorage = localStorageService.getParsedItem<PathFindingAlgorithmRun[]>(
      LocalStorageKey.RunHistory
    );
    return runHistoryFromStorage ?? [];
  });
  const [runHistoryOpen, setRunHistoryOpen] = useState(false);

  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);
  const moreMenuOpen = Boolean(moreMenuAnchorEl);

  const [selection, setSelection] = useState(NodeContextSelection.Wall);

  const [colorOpen, setColorOpen] = useState(false);

  const selections = ['Wall', 'Weight', 'Start', 'End'];

  const handleAboutClick = (): void => {
    setOpenAboutDialog(true);
  };

  const handleHelpClick = (): void => {
    setOpenHelpDialog(true);
  };

  const handleClearRunHistory = (): void => {
    localStorageService.removeItem(LocalStorageKey.RunHistory);
    setRunHistory([]);
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
        case PlayType.Weight:
          onGenerateMaze.next({ playType: PlayType.Weight, mazeType, context });
          break;
        default:
          onFindPath.next({ algo, context });
          break;
      }
    }
  };

  const handleAlgoChange = (newAlgo: PathFindingAlgorithm): void => {
    setCurrAlgo(newAlgo);
  };

  const handleMazeTypeChange = (newMazeType: MazeType): void => {
    setMazeType(newMazeType);
  };

  const handlePlayTypeChange = (newPlayType: PlayType): void => {
    setPlayType(newPlayType);
  };

  const handleSpeedChange = (newSpeed: AnimationSpeed): void => {
    setSpeed(newSpeed);
    context.speed = newSpeed;
  };

  const handleSelection = (): void => {
    const newSelection = (selection + 1) % selections.length;
    onSelectionChange.next(newSelection);
    setSelection(newSelection);
  };

  const getPlayButtonText = (): string => {
    switch (playType) {
      case PlayType.Path:
        return `Visualize ${getAlgoNameText(algo, true)}!`;
      case PlayType.Wall:
        return 'Draw Walls!';
      case PlayType.Weight:
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
      if (isPathFindingAlgorithmRun(event)) {
        const newHistory = [event, ...runHistory].slice(0, 15);
        setRunHistory(newHistory);
        setRunning(false);
        localStorageService.setItem(LocalStorageKey.RunHistory, newHistory);
      } else if (typeof event === 'boolean') {
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
            sx={{ width: 190, height: 36.5 }}
            onClick={handlePlay}
            variant="contained"
            color={running ? 'error' : 'success'}
          >
            {running ? 'Cancel' : getPlayButtonText()}
          </Button>

          <Button disabled={running} onClick={() => setOpenSettingsDialog(true)}>
            Settings
          </Button>

          <SettingsDialog
            open={openSettingsDialog}
            onClose={() => setOpenSettingsDialog(false)}
            onAlgoChosen={handleAlgoChange}
            onSpeedChosen={handleSpeedChange}
            onPlayTypeChosen={handlePlayTypeChange}
            onMazeTypeChosen={handleMazeTypeChange}
            onWeightChosen={w => onWeightChange.next(w)}
          />

          <Button disabled={running} onClick={() => onResetBoard.next()}>
            Clear Board
          </Button>
          <Button disabled={running} onClick={() => onResetPath.next()}>
            Clear Path
          </Button>

          <ColorPicker isDesktop={isDesktop} open={colorOpen} handleClose={() => setColorOpen(false)} />

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

            <Tooltip title="Run History">
              <IconButton onClick={() => setRunHistoryOpen(true)}>
                <History color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Colors">
              <IconButton onClick={() => setColorOpen(true)}>
                <FormatColorFill color="primary" />
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
        <RunHistoryDialog
          open={runHistoryOpen}
          runHistory={runHistory}
          onClose={() => setRunHistoryOpen(false)}
          onClearHistory={handleClearRunHistory}
          onRestoreHistory={run => onRestoreRunHistory.next(run)}
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
              <Menu
                open={moreMenuOpen}
                anchorEl={moreMenuAnchorEl}
                onClose={() => setMoreMenuAnchorEl(null)}
                onClick={() => setMoreMenuAnchorEl(null)}
              >
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

                <MenuItem onClick={() => setRunHistoryOpen(true)}>
                  <ListItemIcon>
                    <History fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Run History</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setOpenLegend(true)}>
                  <ListItemIcon>
                    <LegendToggleOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Legend</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setColorOpen(true)}>
                  <ListItemIcon>
                    <FormatColorFill fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Colors</ListItemText>
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

          <ColorPicker isDesktop={isDesktop} open={colorOpen} handleClose={() => setColorOpen(false)} />

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
            onWeightChosen={w => onWeightChange.next(w)}
          />
          <RunHistoryDialog
            open={runHistoryOpen}
            runHistory={runHistory}
            onClose={() => setRunHistoryOpen(false)}
            onClearHistory={handleClearRunHistory}
            onRestoreHistory={run => onRestoreRunHistory.next(run)}
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
