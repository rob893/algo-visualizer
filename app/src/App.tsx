import { Subject } from 'rxjs';
import './App.css';
import ControlBar from './components/ControlBar';
import BoardGrid from './components/BoardGrid';
import { wasmService } from './services/WasmService';
import { MazeType, PathFindingAlgorithm } from './wasm/algo_visualizer';
import { localStorageService } from './services/LocalStorageService';
import { Fragment, useEffect } from 'react';
import { inputService } from './services/InputService';
import { useViewport } from './hooks/useViewport';
import { NodeContextSelection, PlayType } from './models/enums';
import { PathFindingAlgorithmRun, PlayContext } from './models/models';

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
  const { width: innerWidth, height: innerHeight } = useViewport();

  const defaultNodeHeight = 25;
  const defaultNodeWidth = 25;
  const scaleHeightBreakpoint = 25;
  const scaleWidthBreakpoint = 62;

  const calculateGridWidth = (nodeW: number): number => Math.floor(innerWidth / nodeW) - 2;
  const calculateGridHeight = (nodeH: number): number => {
    const appBarHeight = 120;
    const expectedHeight = Math.floor((innerHeight - appBarHeight) / nodeH);
    const minusNodeBreakpoint = expectedHeight * nodeH + appBarHeight;

    return innerHeight - minusNodeBreakpoint < nodeH / 3 ? expectedHeight - 1 : expectedHeight;
  };

  const scale = Math.min(
    (calculateGridHeight(defaultNodeHeight) / scaleHeightBreakpoint +
      calculateGridWidth(defaultNodeWidth) / scaleWidthBreakpoint) /
      2,
    1.5
  );

  const nodeHeight = Math.max(defaultNodeHeight, defaultNodeHeight * scale);
  const nodeWidth = Math.max(defaultNodeWidth, defaultNodeWidth * scale);

  const gridHeight = calculateGridHeight(nodeHeight);
  const gridWidth = calculateGridWidth(nodeWidth);
  const universe = wasmService.resize(gridWidth, gridHeight);

  const onFindPath = new Subject<
    { algo: PathFindingAlgorithm; context: PlayContext } | PathFindingAlgorithmRun | boolean
  >();
  const onResetPath = new Subject<void>();
  const onResetBoard = new Subject<void>();
  const onWeightChange = new Subject<number>();
  const onGenerateMaze = new Subject<{ playType: PlayType; mazeType: MazeType; context: PlayContext }>();
  const onSelectionChange = new Subject<NodeContextSelection>();
  const onRestoreRunHistory = new Subject<PathFindingAlgorithmRun>();

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
        onWeightChange={onWeightChange}
        onGenerateMaze={onGenerateMaze}
        onRestoreRunHistory={onRestoreRunHistory}
        onSelectionChange={onSelectionChange}
        localStorageService={localStorageService}
      />
      <BoardGrid
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        nodeWidth={nodeWidth}
        nodeHeight={nodeHeight}
        onFindPath={onFindPath}
        onWeightChange={onWeightChange}
        onGenerateMaze={onGenerateMaze}
        onRestoreRunHistory={onRestoreRunHistory}
        onResetBoard={onResetBoard}
        onResetPath={onResetPath}
        onSelectionChange={onSelectionChange}
        universe={universe}
      />
    </Fragment>
  );
}
