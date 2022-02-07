use priority_queue::priority_queue::PriorityQueue;
use wasm_bindgen::prelude::wasm_bindgen;

pub mod universe;

mod priority_queue;

#[wasm_bindgen(typescript_custom_section)]
const IGRID_NODE: &'static str = r#"
interface IGridNode {
    x: number;
    y: number;
    weight: number;
    passable: boolean;
}
"#;

#[wasm_bindgen(typescript_custom_section)]
const IPATH_RESPONSE: &'static str = r#"
interface IPathResponse {
    path: IGridNode[];
    processed: IGridNode[];
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "IPathResponse")]
    pub type IPathResponse;

    #[wasm_bindgen(typescript_type = "IGridNode[]")]
    pub type IMazeResponse;
}
