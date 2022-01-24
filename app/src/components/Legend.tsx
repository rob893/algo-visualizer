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
      <span style={style} className="start-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>End Node:</p>
      <span style={style} className="end-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Wall Node:</p>
      <span style={style} className="wall-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Heavy Node:</p>
      <span style={style} className="heavy-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Visited Node:</p>
      <span style={style} className="visited-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Heavy Visited Node:</p>
      <span style={style} className="visited-heavy-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Path Node:</p>
      <span style={style} className="path-no-animation" />
      <Divider orientation="vertical" sx={{ height: 30 }} />
      <p>Heavy Path Node:</p>
      <span style={style} className="path-heavy-no-animation" />
    </Stack>
  );
}
