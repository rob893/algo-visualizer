interface JSNode {
  x: number;
  y: number;
  weight: number;
  passable: boolean;
}

interface PathResult {
  path: JSNode[];
  processed: JSNode[];
}

// For use to compare performance with web assembly only.
// Not used for more than comparing at this time.
export class JSUniverse {
  public readonly width: number;

  public readonly height: number;

  private readonly nodes: JSNode[][] = [];

  public constructor(width: number, height: number) {
    for (let y = 0; y < height; y++) {
      this.nodes.push([]);
      for (let x = 0; x < width; x++) {
        this.nodes[y].push({
          x,
          y,
          weight: 0,
          passable: true
        });
      }
    }

    this.width = width;
    this.height = height;
  }

  public bfs(startX: number, startY: number, endX: number, endY: number): PathResult {
    const result: PathResult = {
      path: [],
      processed: []
    };

    const frontier: JSNode[] = [];

    const startNode = this.nodes[startY][startX];
    const endNode = this.nodes[endY][endX];

    const visited = new Set<JSNode>();
    const cameFrom = new Map<JSNode, JSNode>();

    visited.add(startNode);
    frontier.unshift(startNode);

    while (frontier.length > 0) {
      const current = frontier.pop();

      if (!current) {
        throw new Error('Invalid');
      }

      result.processed.push(current);

      if (current === endNode) {
        return this.constructPath(result, cameFrom, endNode);
      }

      for (const neighbor of this.getNeighbors(current.x, current.y)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          cameFrom.set(neighbor, current);
          frontier.unshift(neighbor);
        }
      }
    }

    return result;
  }

  public dijkstra(startX: number, startY: number, endX: number, endY: number): PathResult {
    const result: PathResult = {
      path: [],
      processed: []
    };

    const frontier = this.nodes.flat();

    const startNode = this.nodes[startY][startX];
    const endNode = this.nodes[endY][endX];

    const times = new Map<JSNode, number>();
    const cameFrom = new Map<JSNode, JSNode>();

    times.set(startNode, 0);

    while (frontier.length > 0) {
      const index = this.getClosestNode(frontier, times);
      const current = frontier[index];
      frontier.splice(index, 1);

      result.processed.push(current);

      if (current === endNode) {
        return this.constructPath(result, cameFrom, endNode);
      }

      for (const neighbor of this.getNeighbors(current.x, current.y)) {
        const prevTime = times.get(current) ?? Number.MAX_SAFE_INTEGER;
        const newTime = prevTime + neighbor.weight + 1;

        if (newTime < (times.get(neighbor) ?? Number.MAX_SAFE_INTEGER)) {
          times.set(neighbor, newTime);
          cameFrom.set(neighbor, current);
        }
      }
    }

    return result;
  }

  private getClosestNode(nodes: JSNode[], times: Map<JSNode, number>): number {
    let currClosetsIndex = 0;

    for (let i = 0; i < nodes.length; i++) {
      if (
        (times.get(nodes[currClosetsIndex]) ?? Number.MAX_SAFE_INTEGER) >
        (times.get(nodes[i]) ?? Number.MAX_SAFE_INTEGER)
      ) {
        currClosetsIndex = i;
      }
    }

    return currClosetsIndex;
  }

  private getNeighbors(x: number, y: number): JSNode[] {
    const res: JSNode[] = [];

    if (y > 0 && this.nodes[y - 1][x].passable) {
      res.push(this.nodes[y - 1][x]);
    }

    if (y < this.height - 1 && this.nodes[y + 1][x].passable) {
      res.push(this.nodes[y + 1][x]);
    }

    if (x > 0 && this.nodes[y][x - 1].passable) {
      res.push(this.nodes[y][x - 1]);
    }

    if (x < this.width - 1 && this.nodes[y][x + 1].passable) {
      res.push(this.nodes[y][x + 1]);
    }

    return res;
  }

  private constructPath(result: PathResult, cameFrom: Map<JSNode, JSNode>, endNode: JSNode): PathResult {
    let current = endNode;
    result.path.push(current);

    let next = cameFrom.get(current);

    while (next) {
      current = next;
      result.path.push(current);
      next = cameFrom.get(current);
    }

    result.path.reverse();

    return result;
  }
}
