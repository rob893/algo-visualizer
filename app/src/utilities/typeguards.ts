import { PlayContext, PathFindingAlgorithmRun } from '../models/models';
import { PathFindingAlgorithm } from '../wasm/algo_visualizer';

export function isAlgoRequest(e: unknown): e is {
  algo: PathFindingAlgorithm;
  context: PlayContext;
} {
  if ((e as any).context !== undefined && (e as any).algo !== undefined) {
    return true;
  }

  return false;
}

export function isPathFindingAlgorithmRun(e: unknown): e is PathFindingAlgorithmRun {
  if (typeof (e as PathFindingAlgorithmRun).algorithmName === 'string') {
    return true;
  }

  return false;
}
