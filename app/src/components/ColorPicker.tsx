import { Close } from '@mui/icons-material';
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Grid,
  Slide,
  Toolbar,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactElement, Ref, useState } from 'react';
import { LocalStorageKey, NodeType } from '../models/enums';
import { localStorageService } from '../services/LocalStorageService';
import { ColorSettings, NodeTypeColorMapping } from '../models/models';
import { loadColorScheme } from '../utilities/utilities';
import { defaultColorSettings } from '../utilities/defaultColorSettings';
import ColorCard from './ColorCard';
import { colord } from 'colord';

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

  const [mapping, setMapping] = useState(fromStorage ?? defaultColorSettings);

  const getColorGrad = (color: string, from: number = 0, to: number = 0.5): string => {
    const { r, g, b } = colord(color).toRgb();
    return `radial-gradient(rgba(${r}, ${g}, ${b}, ${from}), rgba(${r}, ${g}, ${b}, ${to}))`;
  };

  const saveChanges = (): void => {
    loadColorScheme(mapping);
    localStorageService.setItem(LocalStorageKey.ColorSettings, mapping);
    handleClose();
  };

  const discardAndClose = (): void => {
    const oldSettings = localStorageService.getParsedItem<ColorSettings>(LocalStorageKey.ColorSettings);
    setMapping(oldSettings ?? defaultColorSettings);
    handleClose();
  };

  const updateNodeTypeSettings = (
    nodeType: NodeType,
    action: (curr: NodeTypeColorMapping) => NodeTypeColorMapping
  ): void => {
    const copy = { ...mapping };
    const next = action(copy[nodeType]);
    copy[nodeType] = next;
    setMapping(copy);
  };

  const handleReset = (nodeType: NodeType): void => {
    updateNodeTypeSettings(nodeType, () => ({ ...defaultColorSettings[nodeType] }));
  };

  const handleUseColorGradCheckbox = (nodeType: NodeType, useColorGrad: boolean): void => {
    updateNodeTypeSettings(nodeType, curr => {
      const next: NodeTypeColorMapping = {
        ...curr,
        useColorGrad
      };

      if (!next.useColorGrad) {
        next.tempColorGrad = next.tempColor;
        const { r, g, b } = colord(next.tempColor).toRgb();
        next.tempColor = `rgba(${r}, ${g}, ${b}, 0)`;
        next.seperatePrimaryAndSecondary = false;
      } else {
        const { r, g, b } = colord(next.tempColor).toRgb();
        next.tempColor = `rgba(${r}, ${g}, ${b}, 1)`;
        next.tempColorGrad = getColorGrad(next.tempColor);
      }

      return next;
    });
  };

  const handleSeperateColorsCheckbox = (nodeType: NodeType, seperateColors: boolean): void => {
    updateNodeTypeSettings(nodeType, curr => {
      const next: NodeTypeColorMapping = {
        ...curr,
        seperatePrimaryAndSecondary: seperateColors
      };

      if (!next.seperatePrimaryAndSecondary) {
        next.tempColorGrad = getColorGrad(next.tempColor);
      }

      return next;
    });
  };

  const handleColorChange = (
    nodeType: NodeType,
    newColor: string,
    isPrimary: boolean,
    seperateColors: boolean
  ): void => {
    updateNodeTypeSettings(nodeType, curr => {
      const next: NodeTypeColorMapping = {
        ...curr
      };

      if (isPrimary) {
        next.tempColor = newColor;

        if (!seperateColors) {
          next.tempColorGrad = getColorGrad(newColor);
        }
      } else {
        next.tempColorGrad = newColor;
      }

      return next;
    });
  };

  const content = (
    <Grid container spacing={2}>
      {Object.entries(mapping).map(([nodeType, settings]) => {
        const { tempColor, tempColorGrad, seperatePrimaryAndSecondary, useColorGrad, text } = settings;

        return (
          <Grid item key={nodeType} xs={12}>
            <ColorCard
              nodeType={nodeType as NodeType}
              title={text}
              tempColor={tempColor}
              tempColorGrad={tempColorGrad}
              seperateColors={seperatePrimaryAndSecondary}
              useColorGrad={useColorGrad}
              onResetToDefault={() => handleReset(nodeType as NodeType)}
              onUseColorGradChange={useGrad => handleUseColorGradCheckbox(nodeType as NodeType, useGrad)}
              onSeperateColorsChange={sepColors => handleSeperateColorsCheckbox(nodeType as NodeType, sepColors)}
              onPrimaryColorChange={newColor =>
                handleColorChange(nodeType as NodeType, newColor, true, seperatePrimaryAndSecondary)
              }
              onSecondaryColorChange={newColor =>
                handleColorChange(nodeType as NodeType, newColor, false, seperatePrimaryAndSecondary)
              }
            />
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
          <Button autoFocus color="inherit" onClick={() => setMapping(defaultColorSettings)}>
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
        <Button autoFocus color="primary" onClick={() => setMapping(defaultColorSettings)}>
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
