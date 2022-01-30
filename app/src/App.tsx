import { Subject } from 'rxjs';
import './App.css';
import ControlBar from './components/ControlBar';
import BoardGrid from './components/BoardGrid';
import { wasmService } from './services/WasmService';
import { PathFindingAlgorithm } from './wasm/algo_visualizer';
import Legend from './components/Legend';
import { localStorageService } from './services/LocalStorageService';
import { useEffect, useState } from 'react';

/**
 * !!! TO ANYONE READING !!!
 * There are a lot of 'non-react' ways of doing things in this project (rxjs, document.getElementById, etc) due to performance issues.
 * Updating the class name using state or keeping the grid immutable while lifting state up by copying it every mutation caused huge amounts of lag
 * (copying a 1-2k element array then re-rendering the entire grid multiple times per second while drawing walls or animating paths is silly).
 * To fix this, the methods chosen were used which eliminated all performance issues.
 *
 * I am sure there is a more 'react' way to do it but  ¯\_(ツ)_/¯
 */
function App(): JSX.Element {
  const nodeHeight = 25;
  const nodeWidth = 25;

  const calculateGridWidth = (): number => Math.floor(window.innerWidth / nodeWidth) - 2;
  const calculateGridHeight = (): number => {
    const innerHeight = window.innerHeight;
    const appBarHeight = 120;
    const expectedHeight = Math.floor((innerHeight - appBarHeight) / nodeHeight);
    const minusNodeBreakpoint = expectedHeight * nodeHeight + appBarHeight;

    return innerHeight - minusNodeBreakpoint < nodeHeight / 3 ? expectedHeight - 1 : expectedHeight;
  };

  const [gridWidth, setGridWidth] = useState(calculateGridWidth());
  const [gridHeight, setGridHeight] = useState(calculateGridHeight());
  const [universe, setUniverse] = useState(wasmService.resize(gridWidth, gridHeight));

  const onFindPath = new Subject<
    { algo: PathFindingAlgorithm; context: { cancel: boolean; speed: number } } | boolean
  >();
  const onResetPath = new Subject<void>();
  const onResetBoard = new Subject<void>();
  const onGenerateMaze = new Subject<number>();

  const handleResize = (): void => {
    const newWidth = calculateGridWidth();
    const newHeight = calculateGridHeight();

    if (newHeight === gridHeight && newWidth === gridWidth) {
      return;
    }

    setGridWidth(newWidth);
    setGridHeight(newHeight);
    setUniverse(wasmService.resize(newWidth, newHeight));
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div>
      <ControlBar
        onFindPath={onFindPath}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        onGenerateMaze={onGenerateMaze}
        localStorageService={localStorageService}
      />
      <Legend />
      <BoardGrid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        nodeWidth={nodeWidth}
        nodeHeight={nodeHeight}
        onFindPath={onFindPath}
        onGenerateMaze={onGenerateMaze}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        universe={universe}
      />
    </div>
  );
}

export default App;
