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
import { CSSProperties, memo, useState, MouseEvent as ReactMouseEvent } from 'react';
import { colord, RgbColor } from 'colord';
import { RgbColorPicker } from 'react-colorful';
import { NodeType } from '../models/enums';

export interface ColorCardProps {
  nodeType: NodeType;
  title: string;
  tempColor: string;
  tempColorGrad: string;
  useColorGrad: boolean;
  seperateColors: boolean;
  onResetToDefault: () => void;
  onUseColorGradChange: (useColorGrad: boolean) => void;
  onSeperateColorsChange: (seperateColors: boolean) => void;
  onPrimaryColorChange: (...params: any[]) => void;
  onSecondaryColorChange: (...params: any[]) => void;
}

function arePropsEqual(a: ColorCardProps, b: ColorCardProps): boolean {
  return (
    a.nodeType === b.nodeType &&
    a.title === b.title &&
    a.tempColor === b.tempColor &&
    a.tempColorGrad === b.tempColorGrad &&
    a.useColorGrad === b.useColorGrad &&
    a.seperateColors === b.seperateColors
  );
}

interface ColorCardPickerState {
  primaryPickerEl: HTMLElement | null;
  secondaryPickerEl: HTMLElement | null;
  primaryColorPickerColor: string;
  primaryColorRgb: RgbColor;
  secondaryColorPickerColor: string;
  secondaryColorRgb: RgbColor;
}

function ColorPickerPopover({
  anchorEl,
  color,
  onClose,
  onChange
}: {
  anchorEl: HTMLElement | null;
  color: RgbColor;
  onClose: () => void;
  onChange: (newColor: RgbColor) => void;
}): JSX.Element {
  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <Card>
        <RgbColorPicker color={color} onChange={onChange} />
      </Card>
    </Popover>
  );
}

function ColorCard({
  nodeType,
  title,
  tempColor,
  tempColorGrad,
  useColorGrad,
  seperateColors,
  onResetToDefault,
  onUseColorGradChange,
  onSeperateColorsChange,
  onSecondaryColorChange,
  onPrimaryColorChange
}: ColorCardProps): JSX.Element {
  const getFirstRGBAFromRadialGradient = (grad: string): string => {
    const endIndex = grad.indexOf('),');
    return grad.substring(16, endIndex + 1);
  };

  const [pickerSettings, setPickerSettings] = useState<ColorCardPickerState>({
    primaryPickerEl: null as HTMLElement | null,
    secondaryPickerEl: null as HTMLElement | null,
    primaryColorPickerColor: tempColor,
    primaryColorRgb: colord(tempColor).toRgb(),
    secondaryColorPickerColor: tempColorGrad,
    secondaryColorRgb: colord(getFirstRGBAFromRadialGradient(tempColorGrad)).toRgb()
  });

  const {
    primaryPickerEl,
    secondaryPickerEl,
    primaryColorPickerColor,
    secondaryColorPickerColor,
    primaryColorRgb,
    secondaryColorRgb
  } = pickerSettings;

  const style: CSSProperties = {
    minWidth: '75px',
    minHeight: '75px',
    width: '75px',
    height: '75px'
  };

  const background =
    nodeType === NodeType.Unvisited
      ? ''
      : secondaryPickerEl || primaryPickerEl
      ? secondaryColorPickerColor
      : tempColorGrad;

  const handleOpenPrimaryColorPicker = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const copy: ColorCardPickerState = { ...pickerSettings, primaryPickerEl: e.currentTarget, secondaryPickerEl: null };
    setPickerSettings(copy);
  };

  const handleOpenSecondaryColorPicker = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const copy: ColorCardPickerState = { ...pickerSettings, primaryPickerEl: null, secondaryPickerEl: e.currentTarget };
    setPickerSettings(copy);
  };

  const handlePopoverClose = (isPrimary: boolean): void => {
    const copy: ColorCardPickerState = { ...pickerSettings, primaryPickerEl: null, secondaryPickerEl: null };

    if (isPrimary) {
      onPrimaryColorChange(copy.primaryColorPickerColor);
    } else {
      onSecondaryColorChange(copy.secondaryColorPickerColor);
    }

    setPickerSettings(copy);
  };

  const handleColorPickerChange = ({ r, g, b }: RgbColor, isPrimary: boolean): void => {
    const copy = { ...pickerSettings };

    if (seperateColors) {
      if (!isPrimary) {
        copy.secondaryColorRgb = { r, g, b };
        copy.secondaryColorPickerColor =
          nodeType === NodeType.Unvisited
            ? ''
            : `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`;
      } else {
        copy.primaryColorRgb = { r, g, b };
        copy.primaryColorPickerColor =
          nodeType === NodeType.Unvisited ? `rgba(${r}, ${g}, ${b}, 0.75)` : `rgb(${r}, ${g}, ${b})`;
      }
    } else {
      copy.primaryColorRgb = { r, g, b };
      copy.secondaryColorRgb = { r, g, b };
      copy.primaryColorPickerColor =
        nodeType === NodeType.Unvisited ? `rgba(${r}, ${g}, ${b}, 0.75)` : `rgb(${r}, ${g}, ${b})`;
      copy.secondaryColorPickerColor =
        nodeType === NodeType.Unvisited
          ? ''
          : useColorGrad
          ? `radial-gradient(rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 0.5))`
          : copy.primaryColorPickerColor;
    }

    setPickerSettings(copy);
  };

  return (
    <Card>
      <Box sx={{ margin: 2 }}>
        <Stack direction="row" display="flex">
          <Stack>
            <Typography variant="h6">{title}</Typography>

            <Stack direction="row" alignItems="center">
              <IconButton sx={{ alignItems: 'left', justifyContent: 'left' }} onClick={onResetToDefault}>
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
                  control={
                    <Checkbox checked={useColorGrad} onChange={e => onUseColorGradChange(e.currentTarget.checked)} />
                  }
                  label="Use Color Gradient"
                />
                {useColorGrad && (
                  <FormControlLabel
                    sx={{ margin: 0 }}
                    control={
                      <Checkbox
                        checked={seperateColors}
                        onChange={e => onSeperateColorsChange(e.currentTarget.checked)}
                      />
                    }
                    label="Seperate Primary and Secondary"
                  />
                )}
              </FormGroup>
            )}

            {seperateColors && (
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
                border: `1px double ${primaryPickerEl ? primaryColorPickerColor : tempColor}`,
                background
              }}
            />
          </Stack>
        </Stack>

        <ColorPickerPopover
          anchorEl={primaryPickerEl}
          color={primaryColorRgb}
          onChange={c => handleColorPickerChange(c, true)}
          onClose={() => handlePopoverClose(true)}
        />
        <ColorPickerPopover
          anchorEl={secondaryPickerEl}
          color={secondaryColorRgb}
          onChange={c => handleColorPickerChange(c, false)}
          onClose={() => handlePopoverClose(false)}
        />
      </Box>
    </Card>
  );
}

export default memo(ColorCard, arePropsEqual);
