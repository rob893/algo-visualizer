import { Close } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  Grid,
  Slide,
  Stack,
  Toolbar,
  Typography,
  Card,
  Box,
  DialogContent
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CSSProperties, forwardRef, ReactElement, Ref } from 'react';

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
  const width = isDesktop ? '25px' : '75px';
  const height = isDesktop ? '25px' : '75px';

  const style: CSSProperties = {
    minWidth: width,
    minHeight: height,
    width,
    height
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
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} scroll="paper">
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
      <DialogContent sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {legendItems.map(([text, className]) => {
            return (
              <Grid item key={className} xs={12}>
                <Card>
                  <Box sx={{ margin: 2 }}>
                    <Stack direction="row" display="flex">
                      <Stack>
                        <Typography variant="h6">{text}</Typography>
                      </Stack>

                      <Stack sx={{ marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={style} className={className} />
                      </Stack>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
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
