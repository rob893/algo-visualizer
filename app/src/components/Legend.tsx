import { Close } from '@mui/icons-material';
import { AppBar, Button, Dialog, Divider, IconButton, Grid, Slide, Stack, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CSSProperties, forwardRef, ReactElement, Ref, Fragment } from 'react';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface LegendProps {
  isDesktop: boolean;
  open: boolean;
  handleClose: () => void;
}

export default function Legend({ isDesktop, open, handleClose }: LegendProps): JSX.Element {
  const style: CSSProperties = {
    minWidth: '25px',
    minHeight: '25px',
    width: '25px',
    height: '25px'
  };

  const legendItems = [
    ['Start Node:', 'start-no-animation'],
    ['End Node:', 'end-no-animation'],
    ['Wall Node:', 'wall-no-animation'],
    ['Weighted Node:', 'weight-no-animation'],
    ['Visited Node:', 'visited-no-animation'],
    ['Weighted Visited Node:', 'visited-weight-no-animation'],
    ['Path Node:', 'path-no-animation'],
    ['Weighted Path Node:', 'path-weight-no-animation']
  ];

  const mobileLegend = (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Legend
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {legendItems.map(([text, className]) => {
          return (
            <Fragment key={className}>
              <Grid item xs={10} sm={4} display="flex" sx={{ alignItems: 'center' }}>
                <p>{text}</p>
              </Grid>

              <Grid item xs={2} display="flex" sx={{ alignItems: 'center', justifyContent: 'right' }}>
                <span style={style} className={className} />
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    </Dialog>
  );

  const desktopLegend = (
    <Stack
      direction="row"
      spacing={2}
      sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}
    >
      {legendItems.map(([text, className], index) => {
        return (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }} key={className}>
            <p>{text}</p>
            <span style={style} className={className} />
            {index < legendItems.length - 1 && <Divider orientation="vertical" sx={{ height: 30 }} />}
          </Stack>
        );
      })}
    </Stack>
  );

  return isDesktop ? desktopLegend : mobileLegend;
}
