import { AnimationSpeed } from '../models/enums';
import { ColorSettings, PathFindingAlgorithmRun } from '../models/models';
import { MazeType, PathFindingAlgorithm, Universe } from '../wasm/algo_visualizer';

export function chunk<T>(arr: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) {
    throw new Error();
  }

  const copy = [...arr];

  const res: T[][] = [];

  for (let i = 0; i < copy.length; i += chunkSize) {
    res.push(copy.slice(i, i + chunkSize));
  }

  return res;
}

export function getAlgoNameText(algo: PathFindingAlgorithm, shortened: boolean = false): string {
  switch (algo) {
    case PathFindingAlgorithm.Astar:
      return shortened ? 'A*' : 'A* Search';
    case PathFindingAlgorithm.AstarBidirectional:
      return shortened ? 'A*' : 'Bidirectional A* Search';
    case PathFindingAlgorithm.Dijkstra:
      return shortened ? "Dijkstra's" : "Dijkstra's Algorithm";
    case PathFindingAlgorithm.GreedyBFS:
      return shortened ? 'Greedy' : 'Greedy Best-First Search';
    case PathFindingAlgorithm.BFS:
      return shortened ? 'BFS' : 'Breadth First Search';
    case PathFindingAlgorithm.BFSBidirectional:
      return shortened ? 'BFS' : 'Bidirectional Breadth First Search';
    case PathFindingAlgorithm.DFS:
      return shortened ? 'DFS' : 'Depth First Search';
    default:
      return shortened ? "Dijkstra's" : "Dijkstra's Algorithm";
  }
}

export function getSpeedText(speed: AnimationSpeed): string {
  switch (speed) {
    case AnimationSpeed.VeryFast:
      return 'Very Fast';
    case AnimationSpeed.Fast:
      return 'Fast';
    case AnimationSpeed.Normal:
      return 'Normal';
    case AnimationSpeed.Slow:
      return 'Slow';
    case AnimationSpeed.VerySlow:
      return 'Very Slow';
    default:
      return 'Normal';
  }
}

export function loadColorScheme(colorSettings: ColorSettings): void {
  const root: HTMLElement | null = document.querySelector(':root');

  if (!root) {
    return;
  }

  Object.values(colorSettings).forEach(({ colorName, colorGradName, tempColor, tempColorGrad }) => {
    root.style.setProperty(colorName, tempColor);
    root.style.setProperty(colorGradName, tempColorGrad);
  });
}

export function getMazeTypeText(mazeType: MazeType): string {
  switch (mazeType) {
    case MazeType.RecursiveDivision:
      return 'Recursive Division';
    case MazeType.Random25:
      return 'Random 25%';
    case MazeType.Random50:
      return 'Random 50%';
    case MazeType.Random75:
      return 'Random 75%';
    default:
      return 'Recursive Division';
  }
}

export async function wait(ms: number): Promise<void> {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

export type Point = { x: number; y: number };

export function getKey(x: number, y: number): string;
export function getKey(node: Point): string;
export function getKey(xOrNode: number | Point, y?: number): string {
  if (typeof xOrNode === 'number') {
    return `${xOrNode},${y}`;
  }

  return `${xOrNode.x},${xOrNode.y}`;
}

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function getPoint(key: string): Point {
  const [x, y] = key.split(',');
  return { x: Number(x), y: Number(y) };
}

export async function drawPath(
  universe: Universe,
  { x: sx, y: sy }: Point,
  { x: ex, y: ey }: Point,
  algo: PathFindingAlgorithm,
  context: { cancel: boolean; speed: number }
): Promise<PathFindingAlgorithmRun> {
  const t0 = performance.now();
  const res = universe.findPath(sx, sy, ex, ey, algo);
  const timeTaken = performance.now() - t0;
  const stats: PathFindingAlgorithmRun = {
    algorithmName: getAlgoNameText(algo),
    pathNodeCount: res.path.length,
    pathCost: res.path.length + res.path.reduce((prev, curr) => prev + curr.weight, 0),
    processedNodeCount: res.processed.length,
    timeTaken,
    timestamp: new Date()
  };

  let prev: HTMLElement | null = null;

  for (const visitedNode of res.processed) {
    if (context.cancel) {
      return stats;
    }

    const ele = document.getElementById(getKey(visitedNode));

    if (ele) {
      if (ele.className !== 'start' && ele.className !== 'end') {
        ele.className = 'current';
      }

      await wait(context.speed);

      prev = ele;

      if (prev.className !== 'start' && prev.className !== 'end') {
        if (visitedNode.weight > 0) {
          prev.className = 'visited-weight';
        } else {
          prev.className = 'visited';
        }
      }
    }
  }

  for (const pathNode of res.path) {
    if (context.cancel) {
      return stats;
    }

    const ele = document.getElementById(getKey(pathNode));

    if (ele) {
      if (ele.className !== 'start' && ele.className !== 'end') {
        ele.className = 'current';
      }

      await wait(context.speed);

      prev = ele;

      if (prev.className !== 'start' && prev.className !== 'end') {
        if (pathNode.weight > 0) {
          prev.className = 'path-weight';
        } else {
          prev.className = 'path';
        }
      }
    }
  }

  return stats;
}
