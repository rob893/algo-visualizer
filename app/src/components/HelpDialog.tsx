import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import ControlsGuide from './ControlsGuide';

export interface HelpDialogProps {
  open: boolean;
  showHelpAtStartChecked: boolean;
  onShowHelpCheckboxChange: (checked: boolean) => void;
  onClose: () => void;
  title?: string;
}

export default function HelpDialog({
  open,
  showHelpAtStartChecked,
  onShowHelpCheckboxChange,
  onClose,
  title = 'Help'
}: HelpDialogProps): JSX.Element {
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
          control={
            <Checkbox checked={showHelpAtStartChecked} onChange={e => onShowHelpCheckboxChange(e.target.checked)} />
          }
          label="Show help at start"
        />
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
