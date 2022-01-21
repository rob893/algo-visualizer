import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Subject } from 'rxjs';
import { inputService, MouseButton } from '../services/InputService';
import { drawPath, getKey, getPoint } from '../utilities/utilities';
import { Universe } from '../wasm/algo_visualizer';
import { Node, PathFindingAlgorithm } from '../wasm/algo_visualizer';
import GridNode from './GridNode';

export interface GridProps {
  gridWidth: number;
  gridHeight: number;
  onFindPath: Subject<{ speed: number; algo: PathFindingAlgorithm }>;
  onResetPath: Subject<void>;
  onResetBoard: Subject<void>;
  universe: Universe;
}

export default function Grid({
  gridWidth,
  gridHeight,
  onFindPath,
  onResetPath,
  onResetBoard,
  universe
}: GridProps): JSX.Element {
  let start = '0,0';
  let end = '5,5';

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

      if (ele && (ele.className === 'visited' || ele.className === 'path')) {
        ele.className = '';
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

  const handleOnMouseEnter = (nodeKey: string, node: Node): void => {
    if (inputService.getMouseButton(MouseButton.LeftMouseButton)) {
      if (node.passable && nodeKey !== start && nodeKey !== end) {
        setWall(node, nodeKey);
      }
    }
  };

  const handleOnClick = (nodeKey: string, node: Node): void => {
    if (inputService.getKey('w')) {
      setHeavy(node, nodeKey);
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
    const pathSub = onFindPath.subscribe(({ speed, algo }) =>
      drawPath(universe, getPoint(start), getPoint(end), algo, speed)
    );
    const resetBoardSub = onResetBoard.subscribe(handleReset);
    const resetPathSub = onResetPath.subscribe(handleResetPath);

    return () => {
      pathSub.unsubscribe();
      resetBoardSub.unsubscribe();
      resetPathSub.unsubscribe();
    };
  });

  return (
    <Box paddingTop={2} display="flex" justifyContent="center">
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
