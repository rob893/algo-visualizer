import { memo } from 'react';
import { wasmService } from '../services/WasmService';
import { getPoint } from '../utilities/utilities';
import { Node } from '../wasm/algo_visualizer';

export interface GridNodeProps {
  nodeKey: string;
  className: string;
  // onSetAsStart: (newStartKey: string) => void;
  // onSetAsEnd: (newEndKey: string) => void;
  onClick: (nodeKey: string, node: Node) => void;
  onMouseEnter: (nodeKey: string, node: Node) => void;
}

const GridNode = memo(({ nodeKey, className, onClick, onMouseEnter }: GridNodeProps): JSX.Element => {
  //console.log(`${nodeKey}`);
  const point = getPoint(nodeKey);
  const node = wasmService.universe.getCell(point.x, point.y);
  // const [className, setClassName] = useState(initialClass);

  // if (isStart || isEnd) {
  //   wasmService.universe.setWeight(node.x, node.y, 0);
  //   wasmService.universe.setPassable(node.x, node.y, true);
  // }

  // function handleOnMouseEnter(): void {
  //   if (inputService.getMouseButton(MouseButton.LeftMouseButton)) {
  //     if (node.passable) {
  //       wasmService.universe.setPassable(node.x, node.y, false);
  //       setClassName('wall');
  //     }
  //   }
  // }

  // function handleOnClick(): void {
  //   if (inputService.getKey('w')) {
  //     console.log('w pressed');
  //     wasmService.universe.setWeight(node.x, node.y, 15);
  //     wasmService.universe.setPassable(node.x, node.y, true);

  //     setClassName('heavy');
  //   } else if (inputService.getKey('s')) {
  //     // console.log('s pressed');
  //     // wasmService.universe.setWeight(node.x, node.y, 0);
  //     // wasmService.universe.setPassable(node.x, node.y, true);

  //     // const oldEle = document.getElementById(startKey);

  //     // if (oldEle) {
  //     //   oldEle.className = 'unvisited';
  //     // }

  //     setClassName('start');
  //     onSetAsStart(nodeKey);
  //   } else if (inputService.getKey('e')) {
  //     console.log('e pressed');
  //     // wasmService.universe.setWeight(node.x, node.y, 0);
  //     // wasmService.universe.setPassable(node.x, node.y, true);

  //     // const oldEle = document.getElementById(endKey);

  //     // if (oldEle) {
  //     //   oldEle.className = 'unvisited';
  //     // }

  //     setClassName('end');
  //     onSetAsEnd(nodeKey);
  //   } else {
  //     console.log('nothing pressed');
  //     if (node.passable) {
  //       wasmService.universe.setPassable(node.x, node.y, false);
  //       setClassName('wall');
  //     } else {
  //       wasmService.universe.setPassable(node.x, node.y, true);
  //       setClassName('');
  //     }
  //   }
  // }

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
      onMouseEnter={() => onMouseEnter(nodeKey, node)}
      onClick={() => onClick(nodeKey, node)}
    ></td>
  );
});

export default GridNode;
