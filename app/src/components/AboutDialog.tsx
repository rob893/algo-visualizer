import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Tab, Tabs } from '@mui/material';
import { ReactNode, SyntheticEvent, useState } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ paddingTop: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`
  };
}

export interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutDialog({ open, onClose }: AboutDialogProps): JSX.Element {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="about-dialog-title"
      aria-describedby="about-dialog-description"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="about-dialog-title">About</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Pathfinding Algorithms" {...a11yProps(1)} />
            <Tab label="Maze Algorithms" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <p>This application visualizes various pathfinding algorithms.</p>

          <p>
            This stands out from the many other pathfinding visualizers out there in that all of the pathfinding logic
            is written in Rust and compiled to web assembly to be ran at runtime.
          </p>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <p>
            <Link href="https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm" target="_blank" rel="noopener">
              Dijkstra's Algorithm
            </Link>{' '}
            is a <strong>weighted</strong> algorithm that guarantees the shortest path.
          </p>
          <p>
            <Link href="https://en.wikipedia.org/wiki/A*_search_algorithm" target="_blank" rel="noopener">
              A* Search
            </Link>{' '}
            is a <strong>weighted</strong> algorithm that guarantees the shortest path.
          </p>
          <p>
            <Link href="https://en.wikipedia.org/wiki/Best-first_search#Greedy_BFS" target="_blank" rel="noopener">
              Greedy Best First Search
            </Link>{' '}
            is a <strong>weighted</strong> algorithm that does not guarantee the shortest path.
          </p>
          <p>
            <Link href="https://en.wikipedia.org/wiki/Breadth-first_search" target="_blank" rel="noopener">
              Breadth First Search
            </Link>{' '}
            is an <strong>unweighted</strong> algorithm that guarantees the shortest path.
          </p>
          <p>
            <Link href="https://en.wikipedia.org/wiki/Depth-first_search" target="_blank" rel="noopener">
              Depth First Search
            </Link>{' '}
            is an <strong>unweighted</strong> algorithm that does not guarantee the shortest path.
          </p>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <p>Coming soon!</p>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
