use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub enum PathFindingAlgorithm {
    Astar,
    Dijkstra,
    BFS,
    DFS,
    GreedyBFS,
}
