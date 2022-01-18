import { useState, memo } from 'react';
import { inputService, MouseButton } from '../services/InputService';
import { wasmService } from '../services/WasmService';
import { getPoint } from '../utilities/utilities';

export interface GridNodeProps {
  nodeKey: string;
  isStart: boolean;
  isEnd: boolean;
  className?: string;
  onSetAsStart: (newStartKey: string) => void;
  onSetAsEnd: (newEndKey: string) => void;
}

const GridNode = memo(
  ({ nodeKey, startKey, endKey, className: initialClass, onSetAsEnd, onSetAsStart }: GridNodeProps): JSX.Element => {
    console.log(nodeKey);
    const point = getPoint(nodeKey);
    const node = wasmService.universe.getCell(point.x, point.y);
    const [className, setClassName] = useState(initialClass);

    function handleOnMouseEnter(): void {
      if (inputService.getMouseButton(MouseButton.LeftMouseButton)) {
        if (node.passable) {
          wasmService.universe.setPassable(node.x, node.y, false);
          setClassName('wall');
        }
      }
    }

    function handleOnClick(): void {
      if (inputService.getKey('w')) {
        console.log('w pressed');
        wasmService.universe.setWeight(node.x, node.y, 15);
        wasmService.universe.setPassable(node.x, node.y, true);

        setClassName('heavy');
      } else if (inputService.getKey('s')) {
        console.log('s pressed');
        wasmService.universe.setWeight(node.x, node.y, 0);
        wasmService.universe.setPassable(node.x, node.y, true);

        const oldEle = document.getElementById(startKey);

        if (oldEle) {
          oldEle.className = 'unvisited';
        }

        setClassName('start');
        onSetAsStart(nodeKey);
      } else if (inputService.getKey('e')) {
        console.log('e pressed');
        wasmService.universe.setWeight(node.x, node.y, 0);
        wasmService.universe.setPassable(node.x, node.y, true);

        const oldEle = document.getElementById(endKey);

        if (oldEle) {
          oldEle.className = 'unvisited';
        }

        setClassName('end');
        onSetAsEnd(nodeKey);
      } else {
        console.log('nothing pressed');
        if (node.passable) {
          wasmService.universe.setPassable(node.x, node.y, false);
          setClassName('wall');
        } else {
          wasmService.universe.setPassable(node.x, node.y, true);
          setClassName('');
        }
      }
    }

    return (
      <td
        key={nodeKey}
        style={{
          minWidth: '25px',
          minHeight: '25px',
          width: '25px',
          height: '25px'
        }}
        className={className}
        id={nodeKey}
        onMouseEnter={handleOnMouseEnter}
        onClick={handleOnClick}
      ></td>
    );
  }
);

export default GridNode;
