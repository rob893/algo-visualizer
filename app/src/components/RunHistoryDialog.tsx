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
  CardContent
} from '@mui/material';
import { PathFindingAlgorithmRun } from '../models/models';

export interface RunHistoryDialogProps {
  runHistory: PathFindingAlgorithmRun[];
  open: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export default function RunHistoryDialog({
  runHistory,
  open,
  onClose,
  onClearHistory
}: RunHistoryDialogProps): JSX.Element {
  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} scroll="paper" onClose={onClose}>
      <DialogTitle>Run History</DialogTitle>

      <DialogContent dividers={true} sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {runHistory.length > 0 ? (
            runHistory.map(run => {
              return (
                <Grid item key={`${run.algorithmName}-${run.timestamp.getTime()}`} xs={12}>
                  <Card>
                    <CardHeader title={run.algorithmName} subheader={run.timestamp.toLocaleString()} />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Path found in {run.timeTaken.toFixed(2)}ms.
                        <br />
                        <br />
                        Path Node Count: {run.pathNodeCount}
                        <br />
                        Path Cost: {run.pathCost}
                        <br />
                        Processed Nodes: {run.processedNodeCount}
                      </Typography>
                    </CardContent>
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
        <Button autoFocus color="primary" onClick={onClearHistory}>
          Clear
        </Button>
        <Button autoFocus color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
