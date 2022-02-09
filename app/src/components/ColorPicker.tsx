import { Close, Edit } from '@mui/icons-material';
import { AppBar, Button, Dialog, IconButton, Grid, Slide, Toolbar, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CSSProperties, forwardRef, ReactElement, Ref, Fragment, useState } from 'react';
import { colord } from 'colord';
import { RgbColorPicker } from 'react-colorful';
import { NodeType } from '../models/enums';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface ColorPickerProps {
  isDesktop: boolean;
  open: boolean;
  handleClose: () => void;
}

export default function ColorPicker({ isDesktop, open, handleClose }: ColorPickerProps): JSX.Element {
  const style: CSSProperties = {
    minWidth: '25px',
    minHeight: '25px',
    width: '25px',
    height: '25px'
  };

  const [mapping, setMapping] = useState<{
    [key in NodeType]: {
      text: string;
      showColorPicker: boolean;
      colorName: string;
      colorGradName: string;
      colorRgb: { r: number; g: number; b: number };
      tempColor: string;
      tempColorGrad: string;
    };
  }>({
    start: {
      text: 'Start Node:',
      showColorPicker: false,
      colorName: '--start-border-color',
      colorGradName: '--start-background-gradient',
      colorRgb: colord('rgba(255, 235, 59, 1)').toRgb(),
      tempColor: 'rgba(255, 235, 59, 1)',
      tempColorGrad: 'radial-gradient(rgba(255, 235, 59, 0), rgba(255, 235, 59, 0.5))'
    },
    end: {
      text: 'End Node:',
      showColorPicker: false,
      colorName: '--end-border-color',
      colorGradName: '--end-background-gradient',
      colorRgb: colord('rgba(118, 255, 5, 1)').toRgb(),
      tempColor: 'rgba(118, 255, 5, 1)',
      tempColorGrad: 'radial-gradient(rgba(118, 255, 5, 0), rgba(118, 255, 5, 0.5))'
    },
    visisted: {
      text: 'Visited Node:',
      showColorPicker: false,
      colorName: '--visited-border-color',
      colorGradName: '--visited-background-gradient',
      colorRgb: colord('rgba(0, 188, 212, 1)').toRgb(),
      tempColor: 'rgba(0, 188, 212, 1)',
      tempColorGrad: 'radial-gradient(rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.5))'
    },
    unvisited: {
      text: 'Wall Node:',
      showColorPicker: false,
      colorName: '--wall-border-color',
      colorGradName: '--wall-background-gradient',
      colorRgb: colord('rgba(244, 67, 54, 1)').toRgb(),
      tempColor: 'rgba(244, 67, 54, 1)',
      tempColorGrad: 'radial-gradient(rgba(213, 0, 0, 0), rgba(213, 0, 0, 0.5))'
    },
    wall: {
      text: 'Wall Node:',
      showColorPicker: false,
      colorName: '--wall-border-color',
      colorGradName: '--wall-background-gradient',
      colorRgb: colord('rgba(244, 67, 54, 1)').toRgb(),
      tempColor: 'rgba(244, 67, 54, 1)',
      tempColorGrad: 'radial-gradient(rgba(213, 0, 0, 0), rgba(213, 0, 0, 0.5))'
    },
    weight: {
      text: 'Weighted Node:',
      showColorPicker: false,
      colorName: '--weight-border-color',
      colorGradName: '--weight-background-gradient',
      colorRgb: colord('rgba(255, 87, 34, 1)').toRgb(),
      tempColor: 'rgba(255, 87, 34, 1)',
      tempColorGrad: 'radial-gradient(rgba(255, 87, 34, 0), rgba(255, 87, 34, 0.5))'
    },
    path: {
      text: 'Path Node:',
      showColorPicker: false,
      colorName: '--path-border-color',
      colorGradName: '--path-background-gradient',
      colorRgb: colord('rgba(76, 175, 80, 1)').toRgb(),
      tempColor: 'rgba(76, 175, 80, 1)',
      tempColorGrad: 'radial-gradient(rgba(76, 175, 80, 0), rgba(76, 175, 80, 0.5))'
    },
    'weighted-path': {
      text: 'Weighted Path Node:',
      showColorPicker: false,
      colorName: '--path-weight-border-color',
      colorGradName: '--path-weight-background-gradient',
      colorRgb: colord('rgba(125, 151, 67, 1)').toRgb(),
      tempColor: 'rgba(125, 151, 67, 1)',
      tempColorGrad: 'radial-gradient(rgba(125, 151, 67, 0), rgba(125, 151, 67, 0.5))'
    },
    'weighted-visited': {
      text: 'Weighted Visited Node:',
      showColorPicker: false,
      colorName: '--visited-weight-border-color',
      colorGradName: '--visited-weight-background-gradient',
      colorRgb: colord('rgba(185, 115, 83, 1)').toRgb(),
      tempColor: 'rgba(185, 115, 83, 1)',
      tempColorGrad: 'radial-gradient(rgba(185, 115, 83, 0), rgba(185, 115, 83, 0.5))'
    }
  });

  const saveChanges = (): void => {
    const root: HTMLElement | null = document.querySelector(':root');
    if (!root) {
      handleClose();
      return;
    }

    Object.values(mapping).forEach(({ colorName, colorGradName, tempColor, tempColorGrad }) => {
      root.style.setProperty(colorName, tempColor);
      root.style.setProperty(colorGradName, tempColorGrad);
    });

    handleClose();
  };

  const mobileLegend = (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit Colors
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Discard
          </Button>
          <Button autoFocus color="inherit" onClick={saveChanges}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {Object.entries(mapping).map(([nodeType, settings]) => {
          return (
            <Fragment key={nodeType}>
              <Grid item xs={10} sm={4} display="flex" sx={{ alignItems: 'center' }}>
                <p>{settings.text}</p>
              </Grid>

              <Grid item xs={2} display="flex" sx={{ alignItems: 'center', justifyContent: 'right' }}>
                <IconButton
                  onClick={() => {
                    const next = {
                      ...settings,
                      showColorPicker: !settings.showColorPicker
                    };

                    const copy = { ...mapping };
                    copy[nodeType as NodeType] = next;

                    setMapping(copy);
                  }}
                >
                  <Edit color="primary" />
                </IconButton>
                <span
                  style={{
                    ...style,
                    border: `1px double ${settings.tempColor}`,
                    background: `${settings.tempColorGrad}`
                  }}
                />
              </Grid>

              {settings.showColorPicker && (
                <RgbColorPicker
                  color={settings.colorRgb}
                  onChange={({ r, g, b }) => {
                    const next = {
                      ...settings,
                      colorRgb: { r, g, b },
                      tempColor: `rgb(${r}, ${g}, ${b})`,
                      tempColorGrad: `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`
                    };

                    const copy = { ...mapping };
                    copy[nodeType as NodeType] = next;

                    setMapping(copy);
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </Grid>
    </Dialog>
  );

  return mobileLegend;
}
