import { memo } from 'react';
import { wasmService } from '../services/WasmService';
import { getPoint } from '../utilities/utilities';
import { Node } from '../wasm/algo_visualizer';

export interface GridNodeProps {
  nodeKey: string;
  className: string;
  onClick: (nodeKey: string, node: Node) => void;
  onMouseEnter: (nodeKey: string, node: Node) => void;
}

const GridNode = memo(({ nodeKey, className, onClick, onMouseEnter }: GridNodeProps): JSX.Element => {
  const point = getPoint(nodeKey);
  const node = wasmService.universe.getCell(point.x, point.y);

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
