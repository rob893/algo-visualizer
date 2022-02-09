import { NodeType } from './enums';

export interface PlayContext {
  cancel: boolean;
  speed: number;
}

export interface NodeTypeColorMapping {
  text: string;
  colorName: string;
  colorGradName: string;
  colorRgb: { r: number; g: number; b: number };
  tempColor: string;
  tempColorGrad: string;
  menuAnchorEl: HTMLElement | null;
}

export type ColorSettings = {
  [key in NodeType]: NodeTypeColorMapping;
};
