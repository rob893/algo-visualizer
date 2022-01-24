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
        <p>This application visualizes various pathfinding algorithms.</p>
        <p>
          This stands out from the many other pathfinding visualizers out there in that all of the pathfinding logic is
          written in Rust and compiled to web assembly to be ran at runtime.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
