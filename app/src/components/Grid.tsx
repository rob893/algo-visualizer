import { wasmService } from '../services/WasmService';
import { getKey } from '../utilities/utilities';
import GridNode from './GridNode';

export interface GridProps {
  rows: number;
  cols: number;
}

export default function Grid(): JSX.Element {
  let start = '0,0';
  let end = '5,5';

  const gridKeys: string[][] = [];

  for (let y = 0; y < 15; y++) {
    gridKeys.push([]);

    for (let x = 0; x < 35; x++) {
      gridKeys[y].push(getKey(x, y));
    }
  }

  //   function resetPath(): void {
  //     gridKeys.flat().forEach(nodeKey => {
  //       const ele = document.getElementById(nodeKey);

  //       if (ele && (ele.className === 'visited' || ele.className === 'path')) {
  //         ele.className = '';
  //       }
  //     });
  //   }

  function resetGrid(): void {
    wasmService.universe.reset();
    gridKeys.flat().forEach(nodeKey => {
      const ele = document.getElementById(nodeKey);

      if (ele) {
        ele.className = '';
      }
    });
  }

  resetGrid();

  return (
    <table id="grid">
      {/* <tbody>
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
                    startKey={start}
                    endKey={end}
                    className={className}
                    onSetAsEnd={newEnd => {
                      end = newEnd;
                    }}
                    onSetAsStart={newStart => {
                      start = newStart;
                    }}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody> */}
    </table>
  );
}
