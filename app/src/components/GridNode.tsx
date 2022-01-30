import { memo } from 'react';
import { getPoint, Point } from '../utilities/utilities';

export interface GridNodeProps {
  nodeKey: string;
  className: string;
  nodeWidth: number;
  nodeHeight: number;
  onClick: (nodeKey: string, point: Point) => void;
  onMouseEnter: (nodeKey: string, point: Point) => void;
}

const GridNode = memo(
  ({ nodeKey, className, nodeWidth, nodeHeight, onClick, onMouseEnter }: GridNodeProps): JSX.Element => {
    const point = getPoint(nodeKey);

    return (
      <td
        key={nodeKey}
        style={{
          minWidth: `${nodeWidth}px`,
          minHeight: `${nodeHeight}px`,
          width: `${nodeWidth}px`,
          height: `${nodeHeight}px`
        }}
        className={className}
        id={nodeKey}
        onMouseEnter={() => onMouseEnter(nodeKey, point)}
        onClick={() => onClick(nodeKey, point)}
      ></td>
    );
  }
);

export default GridNode;
