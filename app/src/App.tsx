import { Subject } from 'rxjs';
import './App.css';
import ControlBar from './components/ControlBar';
import BoardGrid from './components/BoardGrid';
import { wasmService } from './services/WasmService';
import { PathFindingAlgorithm } from './wasm/algo_visualizer';
import Legend from './components/Legend';
import { localStorageService } from './services/LocalStorageService';

function App(): JSX.Element {
  const gridWidth = 60;
  const gridHeight = 25;

  wasmService.gridWidth = gridWidth;
  wasmService.gridHeight = gridHeight;

  const universe = wasmService.universe;

  const onFindPath = new Subject<
    { speed: number; algo: PathFindingAlgorithm; cancelToken: { cancel: boolean } } | boolean
  >();
  const onResetPath = new Subject<void>();
  const onResetBoard = new Subject<void>();

  return (
    <div>
      <ControlBar
        onFindPath={onFindPath}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        localStorageService={localStorageService}
      />
      <Legend />
      <BoardGrid
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
