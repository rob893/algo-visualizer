import { useState } from 'react';
import { inputService, MouseButton } from '../services/InputService';
import { wasmService } from '../services/WasmService';
import { getPoint } from '../utilities/utilities';

export interface GridNodeProps {
  nodeKey: string;
  startKey: string;
  endKey: string;
  className?: string;
  onSetAsStart: (newStartKey: string) => void;
  onSetAsEnd: (newEndKey: string) => void;
}

export default function GridNode({
  nodeKey,
  startKey,
  endKey,
  className: initialClass,
  onSetAsEnd,
  onSetAsStart
}: GridNodeProps): JSX.Element {
  const point = getPoint(nodeKey);
  const node = wasmService.universe.getCell(point.x, point.y);

  const [className, setClassName] = useState(initialClass);

  return (
    <td
      key={nodeKey}
      width="25px"
      height="25px"
      className={className}
      id={nodeKey}
      onMouseEnter={() => {
        if (inputService.getMouseButton(MouseButton.LeftMouseButton)) {
          if (node.passable) {
            wasmService.universe.setPassable(node.x, node.y, false);
            setClassName('wall');
          }
        }
      }}
      onClick={() => {
        if (inputService.getKey('w')) {
          wasmService.universe.setWeight(node.x, node.y, 15);
          wasmService.universe.setPassable(node.x, node.y, true);

          setClassName('heavy');
        } else if (inputService.getKey('s')) {
          wasmService.universe.setWeight(node.x, node.y, 0);
          wasmService.universe.setPassable(node.x, node.y, true);

          const oldEle = document.getElementById(startKey);

          if (oldEle) {
            oldEle.className = 'unvisited';
          }

          setClassName('start');

          startKey = nodeKey;
          onSetAsStart(startKey);
        } else if (inputService.getKey('e')) {
          wasmService.universe.setWeight(node.x, node.y, 0);
          wasmService.universe.setPassable(node.x, node.y, true);

          const oldEle = document.getElementById(endKey);

          if (oldEle) {
            oldEle.className = 'unvisited';
          }

          setClassName('end');

          endKey = nodeKey;
          onSetAsEnd(endKey);
        } else {
          if (node.passable) {
            wasmService.universe.setPassable(node.x, node.y, false);
            setClassName('wall');
          } else {
            wasmService.universe.setPassable(node.x, node.y, true);
            setClassName('');
          }
        }
      }}
    ></td>
  );
}
