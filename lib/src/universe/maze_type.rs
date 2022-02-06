use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub enum MazeType {
    Random25,
    Random50,
    Random75,
    RecursiveDivision,
}
