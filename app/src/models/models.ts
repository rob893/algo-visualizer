import { PathFindingAlgorithm } from '../wasm/algo_visualizer';
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
  algorithm: PathFindingAlgorithm;
  pathNodeCount: number;
  pathCost: number;
  processedNodeCount: number;
  timeTaken: number;
  timestamp: number;
  start: string;
  end: string;
  weight: number;
  walls: string[];
  weights: string[];
}
