import { Divider, Stack } from '@mui/material';
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
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>End Node:</p>
      <span style={style} className="end" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Wall Node:</p>
      <span style={style} className="wall" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Heavy Node:</p>
      <span style={style} className="heavy" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Visited Node:</p>
      <span style={style} className="visited" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Heavy Visited Node:</p>
      <span style={style} className="visited-heavy" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Path Node:</p>
      <span style={style} className="path" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Heavy Path Node:</p>
      <span style={style} className="path-heavy" />
    </Stack>
  );
}
