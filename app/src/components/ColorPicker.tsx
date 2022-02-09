import { Close, Edit } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Grid,
  Slide,
  Toolbar,
  Typography,
  Popover,
  Card,
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  DialogTitle,
  DialogActions,
  DialogContent
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { CSSProperties, forwardRef, ReactElement, Ref, useState } from 'react';
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
    minWidth: '75px',
    minHeight: '75px',
    width: '75px',
    height: '75px'
  };

  const defaults: ColorSettings = {
    unvisited: {
      text: 'Unvisited Node',
      colorName: '--unvisited-border-color',
      colorGradName: '--unvisited-background-gradient',
      primaryColorRgb: colord('rgba(98, 0, 234, 0.75)').toRgb(),
      secondaryColorRgb: colord('rgb(98, 0, 234)').toRgb(),
      tempColor: 'rgba(98, 0, 234, 0.75)',
      tempColorGrad: 'radial-gradient(rgba(98, 0, 234, 0.75), rgba(98, 0, 234, 0))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    visisted: {
      text: 'Visited Node',
      colorName: '--visited-border-color',
      colorGradName: '--visited-background-gradient',
      primaryColorRgb: colord('rgba(0, 188, 212, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(0, 188, 212)').toRgb(),
      tempColor: 'rgba(0, 188, 212, 1)',
      tempColorGrad: 'radial-gradient(rgba(0, 188, 212, 0), rgba(0, 188, 212, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    start: {
      text: 'Start Node',
      colorName: '--start-border-color',
      colorGradName: '--start-background-gradient',
      primaryColorRgb: colord('rgba(255, 235, 59, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(255, 235, 59)').toRgb(),
      tempColor: 'rgba(255, 235, 59, 1)',
      tempColorGrad: 'radial-gradient(rgba(255, 235, 59, 0), rgba(255, 235, 59, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    end: {
      text: 'End Node',
      colorName: '--end-border-color',
      colorGradName: '--end-background-gradient',
      primaryColorRgb: colord('rgba(118, 255, 5, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(118, 255, 5)').toRgb(),
      tempColor: 'rgba(118, 255, 5, 1)',
      tempColorGrad: 'radial-gradient(rgba(118, 255, 5, 0), rgba(118, 255, 5, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    wall: {
      text: 'Wall Node',
      colorName: '--wall-border-color',
      colorGradName: '--wall-background-gradient',
      primaryColorRgb: colord('rgba(244, 67, 54, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(244, 67, 54)').toRgb(),
      tempColor: 'rgba(244, 67, 54, 1)',
      tempColorGrad: 'radial-gradient(rgba(213, 0, 0, 0), rgba(213, 0, 0, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    weight: {
      text: 'Weighted Node',
      colorName: '--weight-border-color',
      colorGradName: '--weight-background-gradient',
      primaryColorRgb: colord('rgba(255, 87, 34, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(255, 87, 34)').toRgb(),
      tempColor: 'rgba(255, 87, 34, 1)',
      tempColorGrad: 'radial-gradient(rgba(255, 87, 34, 0), rgba(255, 87, 34, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    path: {
      text: 'Path Node',
      colorName: '--path-border-color',
      colorGradName: '--path-background-gradient',
      primaryColorRgb: colord('rgba(76, 175, 80, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(76, 175, 80)').toRgb(),
      tempColor: 'rgba(76, 175, 80, 1)',
      tempColorGrad: 'radial-gradient(rgba(76, 175, 80, 0), rgba(76, 175, 80, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    'weighted-path': {
      text: 'Weighted Path Node',
      colorName: '--path-weight-border-color',
      colorGradName: '--path-weight-background-gradient',
      primaryColorRgb: colord('rgba(125, 151, 67, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(125, 151, 67)').toRgb(),
      tempColor: 'rgba(125, 151, 67, 1)',
      tempColorGrad: 'radial-gradient(rgba(125, 151, 67, 0), rgba(125, 151, 67, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    },
    'weighted-visited': {
      text: 'Weighted Visited Node',
      colorName: '--visited-weight-border-color',
      colorGradName: '--visited-weight-background-gradient',
      primaryColorRgb: colord('rgba(185, 115, 83, 1)').toRgb(),
      secondaryColorRgb: colord('rgb(185, 115, 83)').toRgb(),
      tempColor: 'rgba(185, 115, 83, 1)',
      tempColorGrad: 'radial-gradient(rgba(185, 115, 83, 0), rgba(185, 115, 83, 0.5))',
      menuAnchorEl: null,
      useColorGrad: true,
      seperatePrimaryAndSecondary: false,
      secondaryOpen: false
    }
  };

  const getColorGrad = (color: string, from: number = 0, to: number = 0.5): string => {
    const { r, g, b } = colord(color).toRgb();
    return `radial-gradient(rgba(${r}, ${g}, ${b}, ${from}), rgba(${r}, ${g}, ${b}, ${to}))`;
  };

  const [mapping, setMapping] = useState(fromStorage ?? defaults);

  const saveChanges = (): void => {
    loadColorScheme(mapping);
    localStorageService.setItem(LocalStorageKey.ColorSettings, mapping);
    handleClose();
  };

  const discardAndClose = (): void => {
    const oldSettings = localStorageService.getParsedItem<ColorSettings>(LocalStorageKey.ColorSettings);
    setMapping(oldSettings ?? defaults);
    handleClose();
  };

  const content = (
    <Grid container spacing={2}>
      {Object.entries(mapping).map(([nodeType, settings]) => {
        const background = nodeType === NodeType.Unvisited ? '' : settings.tempColorGrad;
        return (
          <Grid item key={nodeType} xs={12}>
            <Card>
              <Box sx={{ margin: 2 }}>
                <Stack direction="row" display="flex">
                  <Stack>
                    <Typography variant="h6">{settings.text}</Typography>
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        sx={{ alignItems: 'left', justifyContent: 'left' }}
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
                      <Typography>Primary</Typography>
                    </Stack>

                    {nodeType !== NodeType.Unvisited && (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={settings.useColorGrad}
                              onChange={event => {
                                const next: NodeTypeColorMapping = {
                                  ...settings,
                                  useColorGrad: event.target.checked
                                };

                                if (!next.useColorGrad) {
                                  next.tempColorGrad = next.tempColor;
                                  next.secondaryColorRgb = next.primaryColorRgb;
                                  const { r, g, b } = next.primaryColorRgb;
                                  next.tempColor = `rgba(${r}, ${g}, ${b}, 0)`;
                                } else {
                                  const { r, g, b } = next.primaryColorRgb;
                                  next.tempColor = `rgba(${r}, ${g}, ${b}, 1)`;
                                  next.tempColorGrad = getColorGrad(next.tempColor);
                                  next.secondaryColorRgb = next.primaryColorRgb;
                                }

                                const copy = { ...mapping };
                                copy[nodeType as NodeType] = next;

                                setMapping(copy);
                              }}
                            />
                          }
                          label="Use Color Gradient"
                        />
                        {settings.useColorGrad && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={settings.seperatePrimaryAndSecondary}
                                onChange={event => {
                                  const next: NodeTypeColorMapping = {
                                    ...settings,
                                    seperatePrimaryAndSecondary: event.target.checked
                                  };

                                  if (!next.seperatePrimaryAndSecondary) {
                                    next.tempColorGrad = getColorGrad(next.tempColor);
                                    next.secondaryColorRgb = next.primaryColorRgb;
                                  }

                                  const copy = { ...mapping };
                                  copy[nodeType as NodeType] = next;

                                  setMapping(copy);
                                }}
                              />
                            }
                            label="Seperate Primary and Secondary"
                          />
                        )}
                      </FormGroup>
                    )}

                    {settings.seperatePrimaryAndSecondary && (
                      <Stack direction="row" alignItems="center">
                        <IconButton
                          onClick={e => {
                            const next: NodeTypeColorMapping = {
                              ...settings,
                              menuAnchorEl: e.currentTarget,
                              secondaryOpen: true
                            };

                            const copy = { ...mapping };
                            copy[nodeType as NodeType] = next;

                            setMapping(copy);
                          }}
                        >
                          <Edit color="primary" />
                        </IconButton>
                        <Typography>Secondary</Typography>
                      </Stack>
                    )}
                  </Stack>

                  <Stack sx={{ marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                    <span
                      style={{
                        ...style,
                        border: `1px double ${settings.tempColor}`,
                        background
                      }}
                    />
                  </Stack>
                </Stack>
                <Popover
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  open={settings.menuAnchorEl !== null}
                  anchorEl={settings.menuAnchorEl}
                  onClose={() => {
                    const next: NodeTypeColorMapping = {
                      ...settings,
                      menuAnchorEl: null,
                      secondaryOpen: false
                    };

                    const copy = { ...mapping };
                    copy[nodeType as NodeType] = next;

                    setMapping(copy);
                  }}
                >
                  <Card>
                    <RgbColorPicker
                      color={settings.secondaryOpen ? settings.secondaryColorRgb : settings.primaryColorRgb}
                      onChange={({ r, g, b }) => {
                        const next = { ...settings };

                        if (settings.seperatePrimaryAndSecondary) {
                          if (settings.secondaryOpen) {
                            next.secondaryColorRgb = { r, g, b };
                            next.tempColorGrad =
                              nodeType === NodeType.Unvisited
                                ? ''
                                : `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`;
                          } else {
                            next.primaryColorRgb = { r, g, b };
                            next.tempColor =
                              nodeType === NodeType.Unvisited
                                ? `rgba(${r}, ${g}, ${b}, 0.75)`
                                : `rgb(${r}, ${g}, ${b})`;
                          }
                        } else {
                          next.primaryColorRgb = { r, g, b };
                          next.secondaryColorRgb = { r, g, b };
                          next.tempColor =
                            nodeType === NodeType.Unvisited ? `rgba(${r}, ${g}, ${b}, 0.75)` : `rgb(${r}, ${g}, ${b})`;
                          next.tempColorGrad =
                            nodeType === NodeType.Unvisited
                              ? ''
                              : settings.useColorGrad
                              ? `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`
                              : next.tempColor;
                        }

                        const copy = { ...mapping };
                        copy[nodeType as NodeType] = next;

                        setMapping(copy);
                      }}
                    />
                  </Card>
                </Popover>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const mobilePicker = (
    <Dialog fullScreen open={open} onClose={discardAndClose} TransitionComponent={Transition} scroll="paper">
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={discardAndClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 1, flex: 1 }} variant="h6" component="div">
            Colors
          </Typography>
          <Button autoFocus color="inherit" onClick={() => setMapping(defaults)}>
            Defaults
          </Button>
          <Button autoFocus color="inherit" onClick={discardAndClose}>
            Discard
          </Button>
          <Button autoFocus color="inherit" onClick={saveChanges}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ padding: 2 }}>{content}</DialogContent>
    </Dialog>
  );

  const desktopPicker = (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={discardAndClose} scroll="paper">
      <DialogTitle>Colors</DialogTitle>

      <DialogContent dividers={true} sx={{ padding: 2 }}>
        {content}
      </DialogContent>

      <DialogActions>
        <Button autoFocus color="primary" onClick={() => setMapping(defaults)}>
          Defaults
        </Button>
        <Button autoFocus color="primary" onClick={discardAndClose}>
          Discard
        </Button>
        <Button autoFocus color="primary" onClick={saveChanges}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  return isDesktop ? desktopPicker : mobilePicker;
}
