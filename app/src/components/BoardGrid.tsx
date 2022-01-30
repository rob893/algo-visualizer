import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Subject } from 'rxjs';
import { inputService, MouseButton } from '../services/InputService';
import { drawPath, getKey, getPoint, getRandomInt, Point, wait } from '../utilities/utilities';
import { Universe } from '../wasm/algo_visualizer';
import { Node, PathFindingAlgorithm } from '../wasm/algo_visualizer';
import GridNode from './GridNode';

export interface GridProps {
  gridWidth: number;
  gridHeight: number;
  nodeWidth: number;
  nodeHeight: number;
  onFindPath: Subject<{ algo: PathFindingAlgorithm; context: { cancel: boolean; speed: number } } | boolean>;
  onGenerateMaze: Subject<number>;
  onResetPath: Subject<void>;
  onResetBoard: Subject<void>;
  universe: Universe;
}

export default function BoardGrid({
  gridWidth,
  gridHeight,
  nodeWidth,
  nodeHeight,
  onFindPath,
  onGenerateMaze,
  onResetPath,
  onResetBoard,
  universe
}: GridProps): JSX.Element {
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
        } else if (ele.className === 'visited-heavy' || ele.className === 'path-heavy') {
          ele.className = 'heavy';
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

  const setWall = (node: Node, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, false);
    setClass(nodeKey, 'wall');
  };

  const setDefault = (node: Node, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, true);
    setClass(nodeKey, '');
  };

  const setHeavy = (node: Node, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 15);
    universe.setPassable(node.x, node.y, true);
    setClass(nodeKey, 'heavy');
  };

  const setStartPoint = (node: Node, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, true);
    start = nodeKey;
    setClass(nodeKey, 'start');
  };

  const setEndPoint = (node: Node, nodeKey: string): void => {
    universe.setWeight(node.x, node.y, 0);
    universe.setPassable(node.x, node.y, true);
    end = nodeKey;
    setClass(nodeKey, 'end');
  };

  const handleRandomizeWalls = async (num: number): Promise<void> => {
    const computePoint = async (nodeKey: string): Promise<void> => {
      const { x, y } = getPoint(nodeKey);
      const node = universe.getCell(x, y);

      if (nodeKey === start || nodeKey === end || !node.passable || node.weight > 0) {
        return;
      }

      const rand = getRandomInt(100);

      if (rand >= 70) {
        if (num === 0) {
          setWall(node, nodeKey);
        } else {
          setHeavy(node, nodeKey);
        }

        await wait(5);
      }
    };

    for (let y = 0; y < gridKeys.length / 2; y++) {
      for (let x = 0; x < gridKeys[0].length; x++) {
        const topNodeKey = gridKeys[y][x];
        const promises = [computePoint(topNodeKey)];

        if (y !== gridKeys.length - 1 - y) {
          promises.push(computePoint(gridKeys[gridKeys.length - 1 - y][gridKeys[y].length - 1 - x]));
        }

        await Promise.all(promises);
      }
    }
  };

  const handleOnMouseEnter = (nodeKey: string, { x, y }: Point): void => {
    if (inputService.getMouseButton(MouseButton.LeftMouseButton) && nodeKey !== start && nodeKey !== end) {
      const node = universe.getCell(x, y);

      if (inputService.getKey('Shift')) {
        setHeavy(node, nodeKey);
      } else if (node.passable) {
        setWall(node, nodeKey);
      }
    }
  };

  const handleOnClick = (nodeKey: string, { x, y }: Point): void => {
    const node = universe.getCell(x, y);

    if (inputService.getKey('Shift')) {
      if (node.weight > 0) {
        setDefault(node, nodeKey);
      } else {
        setHeavy(node, nodeKey);
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
      if (node.passable) {
        setWall(node, nodeKey);
      } else {
        setDefault(node, nodeKey);
      }
    }
  };

  useEffect(() => {
    const pathSub = onFindPath.subscribe(async event => {
      if (typeof event === 'boolean') {
        return;
      }
      const { algo, context } = event;
      handleResetPath();
      await drawPath(universe, getPoint(start), getPoint(end), algo, context);
      onFindPath.next(true);
    });
    const resetBoardSub = onResetBoard.subscribe(handleReset);
    const resetPathSub = onResetPath.subscribe(handleResetPath);
    const mazeSub = onGenerateMaze.subscribe(handleRandomizeWalls);

    return () => {
      pathSub.unsubscribe();
      resetBoardSub.unsubscribe();
      resetPathSub.unsubscribe();
      mazeSub.unsubscribe();
    };
  });

  handleReset();

  return (
    <Box display="flex" justifyContent="center">
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
