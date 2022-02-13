use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub enum PathFindingAlgorithm {
    Astar,
    AstarBidirectional,
    Dijkstra,
    BFS,
    BFSBidirectional,
    DFS,
    GreedyBFS,
}
