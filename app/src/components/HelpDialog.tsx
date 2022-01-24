import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ControlsGuide from './ControlsGuide';

export interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpDialog({ open, onClose }: HelpDialogProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="help-dialog-title"
      aria-describedby="help-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="help-dialog-title">Help</DialogTitle>
      <DialogContent>
        <ControlsGuide />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
