import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { useState } from 'react';
import { AnimationSpeed } from '../models/enums';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';
import { getAlgoNameText, getSpeedText } from '../utilities/utilities';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onAlgoChosen: (algo: PathFindingAlgorithm) => void;
  onSpeedChosen: (speed: AnimationSpeed) => void;
}

export default function SettingsDialog({
  open,
  onClose,
  onAlgoChosen,
  onSpeedChosen
}: SettingsDialogProps): JSX.Element {
  const [algo, setAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [speed, setSpeed] = useState(AnimationSpeed.Normal);

  const handleAlgoChange = (event: SelectChangeEvent): void => {
    setAlgo(Number(event.target.value));
  };

  const handleSpeedChange = (event: SelectChangeEvent): void => {
    setSpeed(Number(event.target.value));
  };

  const handleSave = (): void => {
    onAlgoChosen(algo);
    onSpeedChosen(speed);
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
        <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
        <Select
          labelId="algorithm-select-label"
          id="algorithm-select"
          value={algo.toString()}
          label="Algorithm"
          onChange={handleAlgoChange}
        >
          <MenuItem value={PathFindingAlgorithm.Dijkstra}>{getAlgoNameText(PathFindingAlgorithm.Dijkstra)}</MenuItem>
          <MenuItem value={PathFindingAlgorithm.Astar}>{getAlgoNameText(PathFindingAlgorithm.Astar)}</MenuItem>
          <MenuItem value={PathFindingAlgorithm.BFS}>{getAlgoNameText(PathFindingAlgorithm.BFS)}</MenuItem>
          <MenuItem value={PathFindingAlgorithm.DFS}>{getAlgoNameText(PathFindingAlgorithm.DFS)}</MenuItem>
        </Select>

        <InputLabel id="speed-select-label">Speed</InputLabel>
        <Select
          labelId="speed-select-label"
          id="speed-select"
          value={speed.toString()}
          label="Speed"
          onChange={handleSpeedChange}
        >
          <MenuItem value={AnimationSpeed.VerySlow}>{getSpeedText(AnimationSpeed.VerySlow)}</MenuItem>
          <MenuItem value={AnimationSpeed.Slow}>{getSpeedText(AnimationSpeed.Slow)}</MenuItem>
          <MenuItem value={AnimationSpeed.Normal}>{getSpeedText(AnimationSpeed.Normal)}</MenuItem>
          <MenuItem value={AnimationSpeed.Fast}>{getSpeedText(AnimationSpeed.Fast)}</MenuItem>
          <MenuItem value={AnimationSpeed.VeryFast}>{getSpeedText(AnimationSpeed.VeryFast)}</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Discard</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
