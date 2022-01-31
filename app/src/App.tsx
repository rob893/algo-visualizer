import { Subject } from 'rxjs';
import './App.css';
import ControlBar, { Selection } from './components/ControlBar';
import BoardGrid from './components/BoardGrid';
import { wasmService } from './services/WasmService';
import { PathFindingAlgorithm } from './wasm/algo_visualizer';
import { localStorageService } from './services/LocalStorageService';
import { Fragment, useEffect } from 'react';
import { inputService } from './services/InputService';
import { useViewport } from './hooks/useViewport';

/**
 * !!! TO ANYONE READING !!!
 * There are a lot of 'non-react' ways of doing things in this project (rxjs, document.getElementById, etc) due to performance issues.
 * Updating the class name using state or keeping the grid immutable while lifting state up by copying it every mutation caused huge amounts of lag
 * (copying a 1-2k element array then re-rendering the entire grid multiple times per second while drawing walls or animating paths is silly).
 * To fix this, the methods chosen were used which eliminated all performance issues.
 *
 * I am sure there is a more 'react' way to do it but  ¯\_(ツ)_/¯
 */
export default function App(): JSX.Element {
  const nodeHeight = 25;
  const nodeWidth = 25;

  const { width: innerWidth, height: innerHeight } = useViewport();

  const calculateGridWidth = (): number => Math.floor(innerWidth / nodeWidth) - 2;
  const calculateGridHeight = (): number => {
    const appBarHeight = 120;
    const expectedHeight = Math.floor((innerHeight - appBarHeight) / nodeHeight);
    const minusNodeBreakpoint = expectedHeight * nodeHeight + appBarHeight;

    return innerHeight - minusNodeBreakpoint < nodeHeight / 3 ? expectedHeight - 1 : expectedHeight;
  };

  const gridWidth = calculateGridWidth();
  const gridHeight = calculateGridHeight();
  const universe = wasmService.resize(gridWidth, gridHeight);

  const onFindPath = new Subject<
    { algo: PathFindingAlgorithm; context: { cancel: boolean; speed: number } } | boolean
  >();
  const onResetPath = new Subject<void>();
  const onResetBoard = new Subject<void>();
  const onGenerateMaze = new Subject<number>();
  const onSelectionChange = new Subject<Selection>();

  useEffect(() => {
    inputService.addEventListeners();

    return () => {
      inputService.removeEventListeners();
    };
  }, []);

  return (
    <Fragment>
      <ControlBar
        onFindPath={onFindPath}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        onGenerateMaze={onGenerateMaze}
        onSelectionChange={onSelectionChange}
        localStorageService={localStorageService}
      />
      <BoardGrid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        nodeWidth={nodeWidth}
        nodeHeight={nodeHeight}
        onFindPath={onFindPath}
        onGenerateMaze={onGenerateMaze}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        onSelectionChange={onSelectionChange}
        universe={universe}
      />
    </Fragment>
  );
}
