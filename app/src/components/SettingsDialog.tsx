import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useState, MouseEvent } from 'react';
import { AnimationSpeed, PlayType } from '../models/enums';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';
import { getAlgoNameText, getSpeedText } from '../utilities/utilities';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onAlgoChosen: (algo: PathFindingAlgorithm) => void;
  onSpeedChosen: (speed: AnimationSpeed) => void;
  onPlayTypeChosen: (playType: PlayType) => void;
}

export default function SettingsDialog({
  open,
  onClose,
  onAlgoChosen,
  onSpeedChosen,
  onPlayTypeChosen
}: SettingsDialogProps): JSX.Element {
  const [algo, setAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [speed, setSpeed] = useState(AnimationSpeed.Normal);
  const [playType, setPlayType] = useState(PlayType.Path);

  const handleAlgoChange = (event: SelectChangeEvent): void => {
    setAlgo(Number(event.target.value));
  };

  const handleSpeedChange = (event: SelectChangeEvent): void => {
    setSpeed(Number(event.target.value));
  };

  const handlePlayTypeChange = (_: MouseEvent<HTMLElement>, newType: PlayType): void => {
    setPlayType(newType);
  };

  const handleSave = (): void => {
    onAlgoChosen(algo);
    onSpeedChosen(speed);
    onPlayTypeChosen(playType);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="settings-dialog-title"
      aria-describedby="settings-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="settings-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
            <Select
              labelId="algorithm-select-label"
              id="algorithm-select"
              value={algo.toString()}
              label="Algorithm"
              onChange={handleAlgoChange}
              fullWidth={true}
            >
              <MenuItem value={PathFindingAlgorithm.Dijkstra}>
                {getAlgoNameText(PathFindingAlgorithm.Dijkstra)}
              </MenuItem>
              <MenuItem value={PathFindingAlgorithm.Astar}>{getAlgoNameText(PathFindingAlgorithm.Astar)}</MenuItem>
              <MenuItem value={PathFindingAlgorithm.GreedyBFS}>
                {getAlgoNameText(PathFindingAlgorithm.GreedyBFS)}
              </MenuItem>
              <MenuItem value={PathFindingAlgorithm.BFS}>{getAlgoNameText(PathFindingAlgorithm.BFS)}</MenuItem>
              <MenuItem value={PathFindingAlgorithm.DFS}>{getAlgoNameText(PathFindingAlgorithm.DFS)}</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel id="speed-select-label">Speed</InputLabel>
            <Select
              labelId="speed-select-label"
              id="speed-select"
              value={speed.toString()}
              label="Speed"
              onChange={handleSpeedChange}
              fullWidth={true}
            >
              <MenuItem value={AnimationSpeed.VerySlow}>{getSpeedText(AnimationSpeed.VerySlow)}</MenuItem>
              <MenuItem value={AnimationSpeed.Slow}>{getSpeedText(AnimationSpeed.Slow)}</MenuItem>
              <MenuItem value={AnimationSpeed.Normal}>{getSpeedText(AnimationSpeed.Normal)}</MenuItem>
              <MenuItem value={AnimationSpeed.Fast}>{getSpeedText(AnimationSpeed.Fast)}</MenuItem>
              <MenuItem value={AnimationSpeed.VeryFast}>{getSpeedText(AnimationSpeed.VeryFast)}</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel id="maze-select-label">Maze</InputLabel>
            <Select labelId="maze-select-label" id="maze-select" value="Random" label="Maze" fullWidth={true}>
              <MenuItem value="Random">Random</MenuItem>
              <MenuItem value="Recursive Division">Recursive Division</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <InputLabel>Play Type</InputLabel>
            <ToggleButtonGroup
              color="primary"
              value={playType}
              exclusive
              fullWidth={true}
              onChange={handlePlayTypeChange}
            >
              <ToggleButton value={PlayType.Path}>Path</ToggleButton>
              <ToggleButton value={PlayType.Wall}>Walls</ToggleButton>
              <ToggleButton value={PlayType.Heavy}>Weights</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Discard</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
