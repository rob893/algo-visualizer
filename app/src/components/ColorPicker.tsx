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

  const handleOnColorPicked = (type: NodeType, newSettings: NodeTypeColorMapping): void => {
    const copy = { ...mapping };
    copy[type] = newSettings;

    setMapping(copy);
  };

  const content = (
    <Grid container spacing={2}>
      {Object.entries(mapping).map(([nodeType, settings]) => {
        return (
          <Grid item key={nodeType} xs={12}>
            <ColorCard
              initialSettings={settings}
              nodeType={nodeType as NodeType}
              onSettingsCommitted={handleOnColorPicked}
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
