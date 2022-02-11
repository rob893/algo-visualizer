import { NodeType } from './enums';

export interface PlayContext {
  cancel: boolean;
  speed: number;
}

export interface NodeTypeColorMapping {
  text: string;
  colorName: string;
  colorGradName: string;
  tempColor: string;
  tempColorGrad: string;
  useColorGrad: boolean;
  seperatePrimaryAndSecondary: boolean;
}

export type ColorSettings = {
  [key in NodeType]: NodeTypeColorMapping;
};
