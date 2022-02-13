export enum NodeContextSelection {
  Wall = 0,
  Weight = 1,
  Start = 2,
  End = 3
}

export enum AnimationSpeed {
  VerySlow = 200,
  Slow = 100,
  Normal = 50,
  Fast = 25,
  VeryFast = 10
}

export enum PlayType {
  Path = 'path',
  Wall = 'wall',
  Weight = 'weight'
}

export enum NodeType {
  Start = 'start',
  End = 'end',
  Visited = 'visisted',
  Unvisited = 'unvisited',
  Wall = 'wall',
  Weight = 'weight',
  Path = 'path',
  WeightedPath = 'weighted-path',
  WeightedVisited = 'weighted-visited'
}

export enum LocalStorageKey {
  ShowHelpAtStart = 'show-help-at-start',
  ColorSettings = 'color-settings',
  RunHistory = 'run-history'
}
