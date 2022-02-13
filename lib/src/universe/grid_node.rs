use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, Default, Hash)]
pub struct GridNode {
    pub x: i32,
    pub y: i32,
    pub weight: i32,
    pub passable: bool,
}
