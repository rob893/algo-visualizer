import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutDialog({ open, onClose }: AboutDialogProps): JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="about-dialog-title"
      aria-describedby="about-dialog-description"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="about-dialog-title">About</DialogTitle>
      <DialogContent>
        <p>Some stuff about this site.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
