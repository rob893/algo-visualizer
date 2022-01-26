import { PathFindingAlgorithm, Universe } from '../wasm/algo_visualizer';

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
): Promise<void> {
  const t0 = performance.now();
  const res = universe.findPath(sx, sy, ex, ey, algo);
  console.log(`WASM path found in ${performance.now() - t0}ms!`);

  let prev: HTMLElement | null = null;

  for (const visitedNode of res.processed) {
    if (context.cancel) {
      return;
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
          prev.className = 'visited-heavy';
        } else {
          prev.className = 'visited';
        }
      }
    }
  }

  for (const pathNode of res.path) {
    if (context.cancel) {
      return;
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
          prev.className = 'path-heavy';
        } else {
          prev.className = 'path';
        }
      }
    }
  }
}
