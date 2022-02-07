import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ paddingTop: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
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
      maxWidth="sm"
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
          This application visualizes various pathfinding algorithms.
          <br />
          <br />
          This stands out from the many other pathfinding visualizers out there in that all of the pathfinding logic is
          written in Rust and compiled to web assembly to be ran at runtime.
        </TabPanel>
        <TabPanel value={value} index={1}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec molestie odio. Maecenas volutpat lacus at
          sagittis ultrices. Vivamus viverra mi vel neque hendrerit congue. Sed lobortis nec tortor sit amet eleifend.
          Vestibulum ultrices sollicitudin aliquet. Praesent dolor justo, sollicitudin a faucibus in, aliquam vel augue.
          Nam facilisis scelerisque justo sed lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Sed pulvinar id nisl in malesuada. Praesent posuere mauris sed justo elementum, gravida
          efficitur nisi tincidunt. Morbi posuere sit amet purus quis egestas. Donec ac lacus quam. Praesent eleifend
          risus dui, ut tempor quam vulputate in. Maecenas eu sapien cursus ante pharetra blandit. Sed ultricies
          facilisis dictum. Vestibulum luctus dui id elit gravida, a pellentesque purus pharetra. Aliquam lobortis
          volutpat neque, ac luctus lectus ullamcorper et. Suspendisse tempor turpis id tortor molestie, non rhoncus
          lacus egestas. Ut hendrerit, tellus non venenatis fringilla, arcu ipsum tincidunt arcu, ut condimentum sapien
          est sit amet dui. Maecenas turpis libero, sollicitudin eu eros et, eleifend molestie lorem. Maecenas iaculis
          pulvinar purus. Duis gravida tempor felis vel sollicitudin. Nam ut posuere dui. Pellentesque vulputate, arcu
          eu mattis rhoncus, lorem risus vulputate nunc, sed condimentum tortor arcu eu neque. Aliquam dignissim sapien
          non ligula malesuada, in vestibulum metus sagittis. Mauris imperdiet odio magna, id consectetur libero auctor
          eleifend. Suspendisse potenti. Nunc venenatis et ante sed gravida. Nunc sit amet augue sit amet dui mollis
          ornare vel non justo. Fusce ac aliquam eros. Donec maximus cursus mauris, sit amet viverra quam eleifend ac.
          Phasellus nunc odio, blandit euismod sollicitudin ut, fringilla nec quam. Etiam ultricies in lectus nec
          fringilla. Vestibulum porttitor pellentesque arcu, a euismod nulla mattis ac. Nunc sed sem egestas, blandit
          ipsum nec, tempus nunc. Donec at augue ligula. Fusce nec vestibulum nunc. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer congue risus velit. Aenean elementum, nisl a
          luctus vehicula, elit augue dignissim justo, at volutpat eros nisl nec mi. Vestibulum aliquam risus nec
          rhoncus suscipit. Curabitur non eleifend dui. Integer vitae justo a eros blandit tempus. Vestibulum bibendum,
          dui et pulvinar rutrum, purus arcu ultrices ipsum, id auctor ex ligula at justo. Nulla mollis, sapien quis
          ultricies sagittis, leo risus posuere elit, ac tincidunt massa metus nec urna. Phasellus a ligula eleifend dui
          vestibulum venenatis. Duis pulvinar sem facilisis pulvinar suscipit. Proin enim tellus, porta id lectus
          facilisis, porta pulvinar tellus. Nam non gravida felis. Nullam vulputate vitae turpis ac tempus. Sed urna
          nulla, sagittis in commodo vitae, venenatis quis nisl. Pellentesque consectetur eros ac blandit porta. Sed sit
          amet nunc eget enim pharetra accumsan. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Curabitur in convallis quam. Vivamus et odio at sapien ornare auctor id ac diam. Sed
          sollicitudin, diam ut volutpat tristique, nunc enim laoreet velit, eu ullamcorper augue nulla eu purus. Cras
          sed mauris turpis. Duis vehicula ultrices aliquet. Proin at rhoncus magna. Duis non nisi ut sem ullamcorper
          interdum sit amet a nulla. Aliquam erat volutpat. Nullam ac feugiat ligula. Nulla facilisi. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        </TabPanel>
        <TabPanel value={value} index={2}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec molestie odio. Maecenas volutpat lacus at
          sagittis ultrices. Vivamus viverra mi vel neque hendrerit congue. Sed lobortis nec tortor sit amet eleifend.
          Vestibulum ultrices sollicitudin aliquet. Praesent dolor justo, sollicitudin a faucibus in, aliquam vel augue.
          Nam facilisis scelerisque justo sed lacinia. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Sed pulvinar id nisl in malesuada. Praesent posuere mauris sed justo elementum, gravida
          efficitur nisi tincidunt. Morbi posuere sit amet purus quis egestas. Donec ac lacus quam. Praesent eleifend
          risus dui, ut tempor quam vulputate in. Maecenas eu sapien cursus ante pharetra blandit. Sed ultricies
          facilisis dictum. Vestibulum luctus dui id elit gravida, a pellentesque purus pharetra. Aliquam lobortis
          volutpat neque, ac luctus lectus ullamcorper et. Suspendisse tempor turpis id tortor molestie, non rhoncus
          lacus egestas. Ut hendrerit, tellus non venenatis fringilla, arcu ipsum tincidunt arcu, ut condimentum sapien
          est sit amet dui. Maecenas turpis libero, sollicitudin eu eros et, eleifend molestie lorem. Maecenas iaculis
          pulvinar purus. Duis gravida tempor felis vel sollicitudin. Nam ut posuere dui. Pellentesque vulputate, arcu
          eu mattis rhoncus, lorem risus vulputate nunc, sed condimentum tortor arcu eu neque. Aliquam dignissim sapien
          non ligula malesuada, in vestibulum metus sagittis. Mauris imperdiet odio magna, id consectetur libero auctor
          eleifend. Suspendisse potenti. Nunc venenatis et ante sed gravida. Nunc sit amet augue sit amet dui mollis
          ornare vel non justo. Fusce ac aliquam eros. Donec maximus cursus mauris, sit amet viverra quam eleifend ac.
          Phasellus nunc odio, blandit euismod sollicitudin ut, fringilla nec quam. Etiam ultricies in lectus nec
          fringilla. Vestibulum porttitor pellentesque arcu, a euismod nulla mattis ac. Nunc sed sem egestas, blandit
          ipsum nec, tempus nunc. Donec at augue ligula. Fusce nec vestibulum nunc. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer congue risus velit. Aenean elementum, nisl a
          luctus vehicula, elit augue dignissim justo, at volutpat eros nisl nec mi. Vestibulum aliquam risus nec
          rhoncus suscipit. Curabitur non eleifend dui. Integer vitae justo a eros blandit tempus. Vestibulum bibendum,
          dui et pulvinar rutrum, purus arcu ultrices ipsum, id auctor ex ligula at justo. Nulla mollis, sapien quis
          ultricies sagittis, leo risus posuere elit, ac tincidunt massa metus nec urna. Phasellus a ligula eleifend dui
          vestibulum venenatis. Duis pulvinar sem facilisis pulvinar suscipit. Proin enim tellus, porta id lectus
          facilisis, porta pulvinar tellus. Nam non gravida felis. Nullam vulputate vitae turpis ac tempus. Sed urna
          nulla, sagittis in commodo vitae, venenatis quis nisl. Pellentesque consectetur eros ac blandit porta. Sed sit
          amet nunc eget enim pharetra accumsan. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Curabitur in convallis quam. Vivamus et odio at sapien ornare auctor id ac diam. Sed
          sollicitudin, diam ut volutpat tristique, nunc enim laoreet velit, eu ullamcorper augue nulla eu purus. Cras
          sed mauris turpis. Duis vehicula ultrices aliquet. Proin at rhoncus magna. Duis non nisi ut sem ullamcorper
          interdum sit amet a nulla. Aliquam erat volutpat. Nullam ac feugiat ligula. Nulla facilisi. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
