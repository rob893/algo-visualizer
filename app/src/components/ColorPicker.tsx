import { Close, Edit } from '@mui/icons-material';
import { AppBar, Button, Dialog, IconButton, Grid, Slide, Toolbar, Typography, Popover, Card } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CSSProperties, forwardRef, ReactElement, Ref, Fragment, useState } from 'react';
import { colord } from 'colord';
import { RgbColorPicker } from 'react-colorful';
import { LocalStorageKey, NodeType } from '../models/enums';
import { localStorageService } from '../services/LocalStorageService';
import { ColorSettings, NodeTypeColorMapping } from '../models/models';
import { loadColorScheme } from '../utilities/utilities';

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
  const fromStorage = localStorageService.getParsedItem<ColorSettings>(LocalStorageKey.ColorSettings);
  const style: CSSProperties = {
    minWidth: '25px',
    minHeight: '25px',
    width: '25px',
    height: '25px'
  };

  const defaults: ColorSettings = {
    start: {
      text: 'Start Node:',
      colorName: '--start-border-color',
      colorGradName: '--start-background-gradient',
      colorRgb: colord('rgba(255, 235, 59, 1)').toRgb(),
      tempColor: 'rgba(255, 235, 59, 1)',
      tempColorGrad: 'radial-gradient(rgba(255, 235, 59, 0), rgba(255, 235, 59, 0.5))',
      menuAnchorEl: null
    },
    end: {
      text: 'End Node:',
      colorName: '--end-border-color',
      colorGradName: '--end-background-gradient',
      colorRgb: colord('rgba(118, 255, 5, 1)').toRgb(),
      tempColor: 'rgba(118, 255, 5, 1)',
      tempColorGrad: 'radial-gradient(rgba(118, 255, 5, 0), rgba(118, 255, 5, 0.5))',
      menuAnchorEl: null
    },
    visisted: {
      text: 'Visited Node:',
      colorName: '--visited-border-color',
      colorGradName: '--visited-background-gradient',
      colorRgb: colord('rgba(0, 188, 212, 1)').toRgb(),
      tempColor: 'rgba(0, 188, 212, 1)',
      tempColorGrad: 'radial-gradient(rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.5))',
      menuAnchorEl: null
    },
    unvisited: {
      text: 'Unvisited Node:',
      colorName: '--unvisited-border-color',
      colorGradName: '--unvisited-background-gradient',
      colorRgb: colord('rgba(98, 0, 234, 0.75)').toRgb(),
      tempColor: 'rgba(98, 0, 234, 0.75)',
      tempColorGrad: 'radial-gradient(rgba(98, 0, 234, 0.75), rgba(98, 0, 234, 0))',
      menuAnchorEl: null
    },
    wall: {
      text: 'Wall Node:',
      colorName: '--wall-border-color',
      colorGradName: '--wall-background-gradient',
      colorRgb: colord('rgba(244, 67, 54, 1)').toRgb(),
      tempColor: 'rgba(244, 67, 54, 1)',
      tempColorGrad: 'radial-gradient(rgba(213, 0, 0, 0), rgba(213, 0, 0, 0.5))',
      menuAnchorEl: null
    },
    weight: {
      text: 'Weighted Node:',
      colorName: '--weight-border-color',
      colorGradName: '--weight-background-gradient',
      colorRgb: colord('rgba(255, 87, 34, 1)').toRgb(),
      tempColor: 'rgba(255, 87, 34, 1)',
      tempColorGrad: 'radial-gradient(rgba(255, 87, 34, 0), rgba(255, 87, 34, 0.5))',
      menuAnchorEl: null
    },
    path: {
      text: 'Path Node:',
      colorName: '--path-border-color',
      colorGradName: '--path-background-gradient',
      colorRgb: colord('rgba(76, 175, 80, 1)').toRgb(),
      tempColor: 'rgba(76, 175, 80, 1)',
      tempColorGrad: 'radial-gradient(rgba(76, 175, 80, 0), rgba(76, 175, 80, 0.5))',
      menuAnchorEl: null
    },
    'weighted-path': {
      text: 'Weighted Path Node:',
      colorName: '--path-weight-border-color',
      colorGradName: '--path-weight-background-gradient',
      colorRgb: colord('rgba(125, 151, 67, 1)').toRgb(),
      tempColor: 'rgba(125, 151, 67, 1)',
      tempColorGrad: 'radial-gradient(rgba(125, 151, 67, 0), rgba(125, 151, 67, 0.5))',
      menuAnchorEl: null
    },
    'weighted-visited': {
      text: 'Weighted Visited Node:',
      colorName: '--visited-weight-border-color',
      colorGradName: '--visited-weight-background-gradient',
      colorRgb: colord('rgba(185, 115, 83, 1)').toRgb(),
      tempColor: 'rgba(185, 115, 83, 1)',
      tempColorGrad: 'radial-gradient(rgba(185, 115, 83, 0), rgba(185, 115, 83, 0.5))',
      menuAnchorEl: null
    }
  };

  const [mapping, setMapping] = useState(fromStorage ?? defaults);

  const saveChanges = (): void => {
    loadColorScheme(mapping);
    localStorageService.setItem(LocalStorageKey.ColorSettings, mapping);
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
          <Button autoFocus color="inherit" onClick={() => setMapping(defaults)}>
            Set Defaults
          </Button>
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
          const background = nodeType === NodeType.Unvisited ? '' : settings.tempColorGrad;
          return (
            <Fragment key={nodeType}>
              <Grid item xs={10} sm={4} display="flex" sx={{ alignItems: 'center' }}>
                <p>{settings.text}</p>
              </Grid>

              <Grid item xs={2} display="flex" sx={{ alignItems: 'center', justifyContent: 'right' }}>
                <IconButton
                  onClick={e => {
                    const next: NodeTypeColorMapping = {
                      ...settings,
                      menuAnchorEl: e.currentTarget
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
                    background
                  }}
                />
              </Grid>

              <Popover
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={settings.menuAnchorEl !== null}
                anchorEl={settings.menuAnchorEl}
                onClose={() => {
                  const next: NodeTypeColorMapping = {
                    ...settings,
                    menuAnchorEl: null
                  };

                  const copy = { ...mapping };
                  copy[nodeType as NodeType] = next;

                  setMapping(copy);
                }}
              >
                <Card>
                  <RgbColorPicker
                    color={settings.colorRgb}
                    onChange={({ r, g, b }) => {
                      const next = {
                        ...settings,
                        colorRgb: { r, g, b },
                        tempColor:
                          nodeType === NodeType.Unvisited ? `rgba(${r}, ${g}, ${b}, 0.75)` : `rgb(${r}, ${g}, ${b})`,
                        tempColorGrad:
                          nodeType === NodeType.Unvisited
                            ? ''
                            : `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`
                      };

                      const copy = { ...mapping };
                      copy[nodeType as NodeType] = next;

                      setMapping(copy);
                    }}
                  />
                </Card>
              </Popover>
            </Fragment>
          );
        })}
      </Grid>
    </Dialog>
  );

  return mobileLegend;
}
