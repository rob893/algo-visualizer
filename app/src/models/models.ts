import { NodeType } from './enums';

export interface PlayContext {
  cancel: boolean;
  speed: number;
}

export interface NodeTypeColorMapping {
  text: string;
  colorName: string;
  colorGradName: string;
  primaryColorRgb: { r: number; g: number; b: number };
  secondaryColorRgb: { r: number; g: number; b: number };
  tempColor: string;
  tempColorGrad: string;
  menuAnchorEl: HTMLElement | null;
  useColorGrad: boolean;
  seperatePrimaryAndSecondary: boolean;
  secondaryOpen: boolean;
}

export type ColorSettings = {
  [key in NodeType]: NodeTypeColorMapping;
};
