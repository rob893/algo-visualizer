use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub extern "C" fn fib(n: u32) -> u32 {
    if n <= 2 {
        return 1;
    }

    return fib(n - 1) + fib(n - 2);
}
