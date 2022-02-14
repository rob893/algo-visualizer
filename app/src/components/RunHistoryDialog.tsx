import {
  Button,
  Dialog,
  Grid,
  Typography,
  Card,
  DialogContent,
  DialogTitle,
  DialogActions,
  CardHeader,
  CardContent,
  CardActions
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { PathFindingAlgorithmRun } from '../models/models';

export interface RunHistoryDialogProps {
  runHistory: PathFindingAlgorithmRun[];
  open: boolean;
  onClose: () => void;
  onClearHistory: () => void;
  onRestoreHistory: (runHistory: PathFindingAlgorithmRun) => void;
}

export default function RunHistoryDialog({
  runHistory,
  open,
  onClose,
  onClearHistory,
  onRestoreHistory
}: RunHistoryDialogProps): JSX.Element {
  const defaultConfirmDialog = useRef({
    show: false,
    title: '',
    body: '',
    yesAction: null as null | (() => void)
  });
  const [confirmDialogOptions, setConfirmDialogOptions] = useState(defaultConfirmDialog.current);

  useEffect(() => {
    if (open) {
      setConfirmDialogOptions(defaultConfirmDialog.current);
    }
  }, [open]);

  const confirmDialog = (
    <Dialog fullWidth={true} maxWidth="sm" open={open}>
      <DialogTitle>{confirmDialogOptions.title}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {confirmDialogOptions.body}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          autoFocus
          color="primary"
          onClick={() => {
            setConfirmDialogOptions({
              ...confirmDialogOptions,
              show: false
            });
          }}
        >
          No
        </Button>
        <Button autoFocus color="primary" onClick={confirmDialogOptions.yesAction ?? onClose}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const dialog = (
    <Dialog fullWidth={true} maxWidth="sm" open={open} scroll="paper" onClose={onClose}>
      <DialogTitle>Run History</DialogTitle>

      <DialogContent dividers={true} sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {runHistory.length > 0 ? (
            runHistory.map(run => {
              return (
                <Grid item key={`${run.algorithmName}-${run.timestamp}`} xs={12}>
                  <Card>
                    <CardHeader title={run.algorithmName} subheader={new Date(run.timestamp).toLocaleString()} />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Path found in {run.timeTaken.toFixed(2)}ms.
                        <br />
                        Path Node Count: {run.pathNodeCount}
                        <br />
                        Path Cost: {run.pathCost}
                        <br />
                        Processed Nodes: {run.processedNodeCount}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        sx={{ marginLeft: 'auto' }}
                        color="primary"
                        onClick={() => {
                          setConfirmDialogOptions({
                            show: true,
                            title: 'Restore State',
                            body: 'Are you sure you want to restore state to this run? Your current grid will be overridden.',
                            yesAction: () => {
                              onRestoreHistory(run);
                              onClose();
                            }
                          });
                        }}
                      >
                        Restore
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    No run history to display.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          autoFocus
          color="primary"
          onClick={() => {
            setConfirmDialogOptions({
              show: true,
              title: 'Clear History',
              body: 'Are you sure you want to clear your run history? This is not recoverable.',
              yesAction: () => {
                onClearHistory();
                onClose();
              }
            });
          }}
        >
          Clear
        </Button>
        <Button autoFocus color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return confirmDialogOptions.show ? confirmDialog : dialog;
}
