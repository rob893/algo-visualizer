import { Typography } from '@mui/material';

export default function ControlsGuide(): JSX.Element {
  return (
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
}
