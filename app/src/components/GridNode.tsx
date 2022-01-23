import { memo } from 'react';
import { getPoint } from '../utilities/utilities';
import { Universe } from '../wasm/algo_visualizer';
import { Node } from '../wasm/algo_visualizer';

export interface GridNodeProps {
  nodeKey: string;
  className: string;
  universe: Universe;
  onClick: (nodeKey: string, node: Node) => void;
  onMouseEnter: (nodeKey: string, node: Node) => void;
}

const GridNode = memo(({ nodeKey, className, universe, onClick, onMouseEnter }: GridNodeProps): JSX.Element => {
  const point = getPoint(nodeKey);

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
      onMouseEnter={() => onMouseEnter(nodeKey, universe.getCell(point.x, point.y))}
      onClick={() => onClick(nodeKey, universe.getCell(point.x, point.y))}
    ></td>
  );
});

export default GridNode;
