import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { LocalStorageService } from '../services/LocalStorageService';
import { LocalStorageKey } from '../utilities/LocalStorageKey';
import ControlsGuide from './ControlsGuide';

export interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
  localStorageService: LocalStorageService;
  title?: string;
}

export default function HelpDialog({
  open,
  onClose,
  localStorageService,
  title = 'Help'
}: HelpDialogProps): JSX.Element {
  const showHelpAtStartFromStorage = localStorageService.getItem(LocalStorageKey.ShowHelpAtStart);
  const [showAtStartChecked, setShowAtStartChecked] = useState(
    showHelpAtStartFromStorage === null || showHelpAtStartFromStorage === 'true'
  );

  const handleHelpCheckbox = (e: ChangeEvent<HTMLInputElement>): void => {
    localStorage.setItem(LocalStorageKey.ShowHelpAtStart, `${e.target.checked}`);
    setShowAtStartChecked(e.target.checked);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="help-dialog-title"
      aria-describedby="help-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="help-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <ControlsGuide />
      </DialogContent>
      <DialogActions>
        <FormControlLabel
          sx={{ marginRight: 'auto', paddingLeft: 1 }}
          control={<Checkbox checked={showAtStartChecked} onChange={handleHelpCheckbox} />}
          label="Show help at start"
        />
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
