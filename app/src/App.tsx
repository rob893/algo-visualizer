import { Subject } from 'rxjs';
import './App.css';
import ControlBar from './components/ControlBar';
import Grid from './components/Grid';
import { wasmService } from './services/WasmService';
import { PathFindingAlgorithm } from './wasm/algo_visualizer';

function App(): JSX.Element {
  const gridWidth = 60;
  const gridHeight = 25;

  wasmService.gridWidth = gridWidth;
  wasmService.gridHeight = gridHeight;

  const universe = wasmService.universe;

  const onFindPath = new Subject<{ speed: number; algo: PathFindingAlgorithm }>();
  const onResetPath = new Subject<void>();
  const onResetBoard = new Subject<void>();

  return (
    <div>
      <ControlBar onFindPath={onFindPath} onResetBoard={onResetBoard} onResetPath={onResetPath} />
      <Grid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        onFindPath={onFindPath}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        universe={universe}
      />
    </div>
  );
}

export default App;
