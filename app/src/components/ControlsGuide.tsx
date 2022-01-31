import { ClearAllOutlined, ClearOutlined, LegendToggleOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';

export default function ControlsGuide({ isDesktop }: { isDesktop: boolean }): JSX.Element {
  const desktopControls = (
    <div>
      <Typography variant="subtitle1">Controls</Typography>
      <ul>
        <li>Hold 's' and click a node to set the start point.</li>
        <li>Hold 'e' and click a node to set the end point.</li>
        <li>
          Click a node to mark the node as a wall.
          <ul>
            <li>Continue to hold the mouse button down and drag to draw wall paths.</li>
          </ul>
        </li>
        <li>
          Hold 'Shift' and click a node to set node as weighted.
          <ul>
            <li>Continue to hold 'Shift' and with mouse button clicked and drag to draw weighted paths.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const mobileControls = (
    <div>
      <Typography variant="subtitle1">Controls</Typography>
      <ul>
        <li>Select the type of node by tapping the node button (defaults as 'wall')</li>
        <ul>
          <li>After a node is selected, tab a grid node to set it as that type.</li>
        </ul>
        <li>
          Tap <LegendToggleOutlined color="primary" /> to view the legend.
        </li>
        <li>
          Tap <ClearAllOutlined color="primary" /> to clear the board (walls, weights, and path).
        </li>
        <li>
          Tap <ClearOutlined color="primary" /> to clear the drawn path.
        </li>
      </ul>
    </div>
  );

  return isDesktop ? desktopControls : mobileControls;
}
