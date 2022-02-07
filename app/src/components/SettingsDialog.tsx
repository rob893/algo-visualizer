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
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useState, MouseEvent } from 'react';
import { AnimationSpeed, PlayType } from '../models/enums';
import { MazeType, PathFindingAlgorithm } from '../wasm/algo_visualizer';
import { getAlgoNameText, getMazeTypeText, getSpeedText } from '../utilities/utilities';

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onAlgoChosen: (algo: PathFindingAlgorithm) => void;
  onSpeedChosen: (speed: AnimationSpeed) => void;
  onPlayTypeChosen: (playType: PlayType) => void;
  onMazeTypeChosen: (mazeType: MazeType) => void;
  onWeightChosen: (newWeight: number) => void;
}

export default function SettingsDialog({
  open,
  onClose,
  onAlgoChosen,
  onSpeedChosen,
  onPlayTypeChosen,
  onMazeTypeChosen,
  onWeightChosen
}: SettingsDialogProps): JSX.Element {
  const [algo, setAlgo] = useState(PathFindingAlgorithm.Dijkstra);
  const [speed, setSpeed] = useState(AnimationSpeed.Normal);
  const [playType, setPlayType] = useState(PlayType.Path);
  const [mazeType, setMazeType] = useState(MazeType.RecursiveDivision);
  const [weight, setWeight] = useState(15);
  const [tempWeightText, setTempWeightText] = useState(weight.toString());

  const handleAlgoChange = (event: SelectChangeEvent): void => {
    setAlgo(Number(event.target.value));
  };

  const handleSpeedChange = (event: SelectChangeEvent): void => {
    setSpeed(Number(event.target.value));
  };

  const handleMazeTypeChange = (event: SelectChangeEvent): void => {
    setMazeType(Number(event.target.value));
  };

  const handleWeightChange = (event: { target: { value: string } }): void => {
    setTempWeightText(event.target.value);
  };

  const handlePlayTypeChange = (_: MouseEvent<HTMLElement>, newType: PlayType): void => {
    setPlayType(newType);
  };

  const handleSave = (): void => {
    onAlgoChosen(algo);
    onSpeedChosen(speed);
    onPlayTypeChosen(playType);
    onMazeTypeChosen(mazeType);

    const weightAsNum = Number(tempWeightText);

    if (!Number.isNaN(weightAsNum) && weightAsNum >= 1) {
      setWeight(weightAsNum);
      onWeightChosen(weightAsNum);
    }

    onClose();
  };

  const handleOnClose = (): void => {
    setTempWeightText(weight.toString());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
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
            <InputLabel id="maze-select-label">Maze</InputLabel>
            <Select
              labelId="maze-select-label"
              id="maze-select"
              value={mazeType.toString()}
              label="Maze"
              fullWidth={true}
              onChange={handleMazeTypeChange}
            >
              <MenuItem value={MazeType.RecursiveDivision}>{getMazeTypeText(MazeType.RecursiveDivision)}</MenuItem>
              <MenuItem value={MazeType.Random25}>{getMazeTypeText(MazeType.Random25)}</MenuItem>
              <MenuItem value={MazeType.Random50}>{getMazeTypeText(MazeType.Random50)}</MenuItem>
              <MenuItem value={MazeType.Random75}>{getMazeTypeText(MazeType.Random75)}</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={6} sm={4}>
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

          <Grid item xs={6} sm={4}>
            <InputLabel id="weight-value-label">Weight Value</InputLabel>
            <TextField
              id="weight-value"
              variant="outlined"
              type="number"
              fullWidth={true}
              value={tempWeightText}
              onChange={handleWeightChange}
            />
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
        <Button onClick={handleOnClose}>Discard</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
