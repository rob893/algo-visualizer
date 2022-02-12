import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Subject } from 'rxjs';
import { inputService, MouseButton } from '../services/InputService';
import { chunk, drawPath, getKey, getPoint, Point, wait } from '../utilities/utilities';
import { IGridNode, Universe } from '../wasm/algo_visualizer';
import { GridNode as WasmGridNode, PathFindingAlgorithm, MazeType } from '../wasm/algo_visualizer';
import { NodeContextSelection, PlayType } from '../models/enums';
import GridNode from './GridNode';
import { PlayContext } from '../models/models';

export interface GridProps {
  gridWidth: number;
  gridHeight: number;
  nodeWidth: number;
  nodeHeight: number;
  onFindPath: Subject<{ algo: PathFindingAlgorithm; context: PlayContext } | boolean>;
  onGenerateMaze: Subject<{ playType: PlayType; mazeType: MazeType; context: PlayContext }>;
  onWeightChange: Subject<number>;
  onResetPath: Subject<void>;
  onResetBoard: Subject<void>;
  onSelectionChange: Subject<NodeContextSelection>;
  universe: Universe;
}

export default function BoardGrid({
  gridWidth,
  gridHeight,
  nodeWidth,
  nodeHeight,
  onFindPath,
  onGenerateMaze,
  onWeightChange,
  onResetPath,
  onResetBoard,
  onSelectionChange,
  universe
}: GridProps): JSX.Element {
  let currSelection = NodeContextSelection.Wall;
  let weight = 15;
  let running = false;
  let start = `${Math.floor(gridWidth / 2 - gridWidth / 4)},${Math.floor(gridHeight / 2)}`;
  let end = `${Math.floor(gridWidth / 2 + gridWidth / 4)},${Math.floor(gridHeight / 2)}`;

  const gridKeys: string[][] = [];

  for (let y = 0; y < gridHeight; y++) {
    gridKeys.push([]);

    for (let x = 0; x < gridWidth; x++) {
      const nodeKey = getKey(x, y);
      gridKeys[y].push(nodeKey);
    }
  }

  const handleSelectionChange = (newSelection: NodeContextSelection): void => {
    currSelection = newSelection;
  };

  const handleReset = (): void => {
    universe.reset();
    gridKeys.flat().forEach(nodeKey => {
      if (nodeKey === start || nodeKey === end) {
        return;
      }

      const ele = document.getElementById(nodeKey);

      if (ele) {
        ele.className = '';
      }
    });
  };

  const handleResetPath = (): void => {
    gridKeys.flat().forEach(nodeKey => {
      const ele = document.getElementById(nodeKey);

      if (ele) {
        if (ele.className === 'visited' || ele.className === 'path') {
          ele.className = '';
        } else if (ele.className === 'visited-weight' || ele.className === 'path-weight') {
          ele.className = 'weight';
        }
      }
    });
  };

  const setClass = (id: string, className: string): void => {
    const ele = document.getElementById(id);

    if (ele) {
      ele.className = className;
    }
  };

  const setWall = (node: WasmGridNode, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, false);
    setClass(nodeKey, 'wall');
  };

  const setDefault = (node: WasmGridNode, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, true);
    setClass(nodeKey, '');
  };

  const setWeighted = (node: WasmGridNode, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, weight);
    universe.setPassable(node.x, node.y, true);
    setClass(nodeKey, 'weight');
  };

  const setStartPoint = (node: WasmGridNode, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, true);
    start = nodeKey;
    setClass(nodeKey, 'start');
  };

  const setEndPoint = (node: WasmGridNode, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, true);
    end = nodeKey;
    setClass(nodeKey, 'end');
  };

  const handleRandomizeWalls = async ({
    playType,
    mazeType,
    context
  }: {
    playType: PlayType;
    mazeType: MazeType;
    context: PlayContext;
  }): Promise<void> => {
    const useChunk = false; // For use if I want to :)
    const maze = universe.generateMaze(mazeType);
    const chunks = chunk(maze, 500);

    const processNode = ({ x, y }: IGridNode): void => {
      const node = universe.getCell(x, y);
      const nodeKey = getKey(x, y);

      if (nodeKey === start || nodeKey === end || !node.passable || node.weight > 0) {
        return;
      }

      if (playType === PlayType.Wall) {
        setWall(node, nodeKey);
      } else {
        setWeighted(node, nodeKey);
      }
    };

    const processChunk = async (chunk: IGridNode[]): Promise<void> => {
      for (let i = 0, j = chunk.length - 1; i < j; i++, j--) {
        if (context.cancel) {
          return;
        }

        processNode(chunk[i]);
        processNode(chunk[j]);

        await wait(context.speed / 2);
      }
    };

    if (useChunk) {
      await Promise.all(chunks.map(chunk => processChunk(chunk)));
    } else {
      for (const node of maze) {
        if (context.cancel) {
          return;
        }

        processNode(node);

        await wait(context.speed / 2);
      }
    }

    onFindPath.next(true);
  };

  const handleOnMouseEnter = (nodeKey: string, { x, y }: Point): void => {
    if (
      (inputService.getMouseButton(MouseButton.LeftMouseButton) || inputService.getTouchDown()) &&
      (currSelection === NodeContextSelection.Weight || currSelection === NodeContextSelection.Wall) &&
      nodeKey !== start &&
      nodeKey !== end &&
      !running
    ) {
      const node = universe.getCell(x, y);

      if (inputService.getKey('Shift') || currSelection === NodeContextSelection.Weight) {
        setWeighted(node, nodeKey);
      } else if (node.passable) {
        setWall(node, nodeKey);
      }
    }
  };

  const actionMap = new Map<NodeContextSelection, (node: WasmGridNode, nodeKey: string) => void>([
    [
      NodeContextSelection.Wall,
      (node: WasmGridNode, nodeKey: string): void => {
        if (node.passable) {
          setWall(node, nodeKey);
        } else {
          setDefault(node, nodeKey);
        }
      }
    ],
    [
      NodeContextSelection.Weight,
      (node: WasmGridNode, nodeKey: string): void => {
        if (node.weight > 0) {
          setDefault(node, nodeKey);
        } else {
          setWeighted(node, nodeKey);
        }
      }
    ],
    [
      NodeContextSelection.Start,
      (node: WasmGridNode, nodeKey: string): void => {
        const prevStartPoint = getPoint(start);
        const prevStartNode = universe.getCell(prevStartPoint.x, prevStartPoint.y);

        setDefault(prevStartNode, start);
        setStartPoint(node, nodeKey);
      }
    ],
    [
      NodeContextSelection.End,
      (node: WasmGridNode, nodeKey: string): void => {
        const prevEndPoint = getPoint(end);
        const prevEndNode = universe.getCell(prevEndPoint.x, prevEndPoint.y);

        setDefault(prevEndNode, end);
        setEndPoint(node, nodeKey);
      }
    ]
  ]);

  const handleOnClick = (nodeKey: string, { x, y }: Point): void => {
    if (running) {
      return;
    }

    const node = universe.getCell(x, y);

    if (inputService.getKey('Shift')) {
      if (node.weight > 0) {
        setDefault(node, nodeKey);
      } else {
        setWeighted(node, nodeKey);
      }
    } else if (inputService.getKey('s')) {
      const prevStartPoint = getPoint(start);
      const prevStartNode = universe.getCell(prevStartPoint.x, prevStartPoint.y);

      setDefault(prevStartNode, start);
      setStartPoint(node, nodeKey);
    } else if (inputService.getKey('e')) {
      const prevEndPoint = getPoint(end);
      const prevEndNode = universe.getCell(prevEndPoint.x, prevEndPoint.y);

      setDefault(prevEndNode, end);
      setEndPoint(node, nodeKey);
    } else {
      const action = actionMap.get(currSelection);

      if (!action) {
        console.error(`${currSelection} is an invalid selection.`);
        return;
      }

      action(node, nodeKey);
    }
  };

  const handleOnFindPath = async (
    event:
      | boolean
      | {
          algo: PathFindingAlgorithm;
          context: PlayContext;
        }
  ): Promise<void> => {
    if (typeof event === 'boolean') {
      return;
    }
    const { algo, context } = event;
    handleResetPath();
    running = true;
    await drawPath(universe, getPoint(start), getPoint(end), algo, context);
    running = false;
    onFindPath.next(true);
  };

  const handleWeightChange = (newWeight: number): void => {
    weight = newWeight;

    gridKeys.flat().forEach(key => {
      const { x, y } = getPoint(key);
      const node = universe.getCell(x, y);

      if (node.weight > 0) {
        universe.setWeight(x, y, weight);
      }
    });
  };

  useEffect(() => {
    const pathSub = onFindPath.subscribe(handleOnFindPath);
    const resetBoardSub = onResetBoard.subscribe(handleReset);
    const resetPathSub = onResetPath.subscribe(handleResetPath);
    const mazeSub = onGenerateMaze.subscribe(handleRandomizeWalls);
    const selectionSub = onSelectionChange.subscribe(handleSelectionChange);
    const weightSub = onWeightChange.subscribe(handleWeightChange);

    return () => {
      pathSub.unsubscribe();
      resetBoardSub.unsubscribe();
      resetPathSub.unsubscribe();
      mazeSub.unsubscribe();
      selectionSub.unsubscribe();
      weightSub.unsubscribe();
    };
  });

  handleReset();

  return (
    <Box display="flex" justifyContent="center" overflow="hidden">
      <table id="grid">
        <tbody>
          {gridKeys.map((row, y) => {
            return (
              <tr key={y}>
                {row.map(nodeKey => {
                  let className = '';

                  if (nodeKey === start) {
                    className = 'start';
                  } else if (nodeKey === end) {
                    className = 'end';
                  }

                  return (
                    <GridNode
                      key={nodeKey}
                      nodeKey={nodeKey}
                      className={className}
                      nodeWidth={nodeWidth}
                      nodeHeight={nodeHeight}
                      onClick={handleOnClick}
                      onMouseEnter={handleOnMouseEnter}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}
