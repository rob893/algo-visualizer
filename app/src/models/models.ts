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

export interface PathFindingAlgorithmRun {
  algorithmName: string;
  pathNodeCount: number;
  pathCost: number;
  processedNodeCount: number;
  timeTaken: number;
  timestamp: Date;
}
