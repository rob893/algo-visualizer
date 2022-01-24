import { Stack } from '@mui/material';
import { CSSProperties } from 'react';

export default function Legend(): JSX.Element {
  const style: CSSProperties = {
    minWidth: '25px',
    minHeight: '25px',
    width: '25px',
    height: '25px'
  };

  return (
    <Stack direction="row" spacing={2} display="flex" alignItems="center" justifyContent="center">
      <p>Start Node:</p>
      <span style={style} className="start" />
      <p>End Node:</p>
      <span style={style} className="end" />
      <p>Wall Node:</p>
      <span style={style} className="wall" />
      <p>Heavy Node:</p>
      <span style={style} className="heavy" />
      <p>Visited Node:</p>
      <span style={style} className="visited" />
      <p>Heavy Visited Node:</p>
      <span style={style} className="visited-heavy" />
      <p>Path Node:</p>
      <span style={style} className="path" />
      <p>Heavy Path Node:</p>
      <span style={style} className="path-heavy" />
    </Stack>
  );
}
