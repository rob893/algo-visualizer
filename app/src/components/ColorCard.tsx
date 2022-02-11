import { Edit, RestartAlt } from '@mui/icons-material';
import {
  IconButton,
  Typography,
  Popover,
  Card,
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import { CSSProperties, memo, useEffect, useState, MouseEvent as ReactMouseEvent, ChangeEvent } from 'react';
import { colord, RgbColor } from 'colord';
import { RgbColorPicker } from 'react-colorful';
import { NodeType } from '../models/enums';
import { NodeTypeColorMapping } from '../models/models';
import { defaultColorSettings } from '../utilities/defaultColorSettings';

export interface ColorCardProps {
  nodeType: NodeType;
  initialSettings: NodeTypeColorMapping;
  onSettingsCommitted: (nodeType: NodeType, settings: NodeTypeColorMapping) => void;
}

function ColorCard({ nodeType, initialSettings, onSettingsCommitted: onColorPicked }: ColorCardProps): JSX.Element {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const style: CSSProperties = {
    minWidth: '75px',
    minHeight: '75px',
    width: '75px',
    height: '75px'
  };
  const background = nodeType === NodeType.Unvisited ? '' : settings.tempColorGrad;

  const getColorGrad = (color: string, from: number = 0, to: number = 0.5): string => {
    const { r, g, b } = colord(color).toRgb();
    return `radial-gradient(rgba(${r}, ${g}, ${b}, ${from}), rgba(${r}, ${g}, ${b}, ${to}))`;
  };

  const handleReset = (): void => {
    const copy = { ...defaultColorSettings[nodeType] };
    setSettings(copy);
    onColorPicked(nodeType, copy);
  };

  const handleOpenPrimaryColorPicker = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const next: NodeTypeColorMapping = {
      ...settings,
      menuAnchorEl: e.currentTarget
    };

    setSettings(next);
  };

  const handleOpenSecondaryColorPicker = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const next: NodeTypeColorMapping = {
      ...settings,
      menuAnchorEl: e.currentTarget,
      secondaryOpen: true
    };

    setSettings(next);
  };

  const handleUseColorGradCheckbox = (event: ChangeEvent<HTMLInputElement>): void => {
    const next: NodeTypeColorMapping = {
      ...settings,
      useColorGrad: event.target.checked
    };

    if (!next.useColorGrad) {
      next.tempColorGrad = next.tempColor;
      next.secondaryColorRgb = next.primaryColorRgb;
      const { r, g, b } = next.primaryColorRgb;
      next.tempColor = `rgba(${r}, ${g}, ${b}, 0)`;
    } else {
      const { r, g, b } = next.primaryColorRgb;
      next.tempColor = `rgba(${r}, ${g}, ${b}, 1)`;
      next.tempColorGrad = getColorGrad(next.tempColor);
      next.secondaryColorRgb = next.primaryColorRgb;
    }

    setSettings(next);
    onColorPicked(nodeType, next);
  };

  const handleSeperateColorsCheckbox = (event: ChangeEvent<HTMLInputElement>): void => {
    const next: NodeTypeColorMapping = {
      ...settings,
      seperatePrimaryAndSecondary: event.target.checked
    };

    if (!next.seperatePrimaryAndSecondary) {
      next.tempColorGrad = getColorGrad(next.tempColor);
      next.secondaryColorRgb = next.primaryColorRgb;
    }

    setSettings(next);
    onColorPicked(nodeType, next);
  };

  const handlePopoverClose = (): void => {
    const next: NodeTypeColorMapping = {
      ...settings,
      menuAnchorEl: null,
      secondaryOpen: false
    };

    setSettings(next);
    onColorPicked(nodeType, next);
  };

  const handleColorPickerChange = ({ r, g, b }: RgbColor): void => {
    const next = { ...settings };

    if (settings.seperatePrimaryAndSecondary) {
      if (settings.secondaryOpen) {
        next.secondaryColorRgb = { r, g, b };
        next.tempColorGrad =
          nodeType === NodeType.Unvisited
            ? ''
            : `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`;
      } else {
        next.primaryColorRgb = { r, g, b };
        next.tempColor = nodeType === NodeType.Unvisited ? `rgba(${r}, ${g}, ${b}, 0.75)` : `rgb(${r}, ${g}, ${b})`;
      }
    } else {
      next.primaryColorRgb = { r, g, b };
      next.secondaryColorRgb = { r, g, b };
      next.tempColor = nodeType === NodeType.Unvisited ? `rgba(${r}, ${g}, ${b}, 0.75)` : `rgb(${r}, ${g}, ${b})`;
      next.tempColorGrad =
        nodeType === NodeType.Unvisited
          ? ''
          : settings.useColorGrad
          ? `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`
          : next.tempColor;
    }

    setSettings(next);
  };

  return (
    <Card>
      <Box sx={{ margin: 2 }}>
        <Stack direction="row" display="flex">
          <Stack>
            <Typography variant="h6">{settings.text}</Typography>

            <Stack direction="row" alignItems="center">
              <IconButton sx={{ alignItems: 'left', justifyContent: 'left' }} onClick={handleReset}>
                <RestartAlt color="primary" />
              </IconButton>
              <Typography>Reset</Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <IconButton sx={{ alignItems: 'left', justifyContent: 'left' }} onClick={handleOpenPrimaryColorPicker}>
                <Edit color="primary" />
              </IconButton>
              <Typography>Primary</Typography>
            </Stack>

            {nodeType !== NodeType.Unvisited && (
              <FormGroup>
                <FormControlLabel
                  sx={{ margin: 0 }}
                  control={<Checkbox checked={settings.useColorGrad} onChange={handleUseColorGradCheckbox} />}
                  label="Use Color Gradient"
                />
                {settings.useColorGrad && (
                  <FormControlLabel
                    sx={{ margin: 0 }}
                    control={
                      <Checkbox
                        checked={settings.seperatePrimaryAndSecondary}
                        onChange={handleSeperateColorsCheckbox}
                      />
                    }
                    label="Seperate Primary and Secondary"
                  />
                )}
              </FormGroup>
            )}

            {settings.seperatePrimaryAndSecondary && (
              <Stack direction="row" alignItems="center">
                <IconButton onClick={handleOpenSecondaryColorPicker}>
                  <Edit color="primary" />
                </IconButton>
                <Typography>Secondary</Typography>
              </Stack>
            )}
          </Stack>

          <Stack sx={{ marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                ...style,
                border: `1px double ${settings.tempColor}`,
                background
              }}
            />
          </Stack>
        </Stack>
        <Popover
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          open={settings.menuAnchorEl !== null}
          anchorEl={settings.menuAnchorEl}
          onClose={handlePopoverClose}
        >
          <Card>
            <RgbColorPicker
              color={settings.secondaryOpen ? settings.secondaryColorRgb : settings.primaryColorRgb}
              onChange={handleColorPickerChange}
            />
          </Card>
        </Popover>
      </Box>
    </Card>
  );
}

export default memo(ColorCard);
