use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fib(n: u32) -> u32 {
    if n <= 2 {
        return 1;
    }

    return fib(n - 1) + fib(n - 2);
}

#[wasm_bindgen]
pub fn test(arr: Vec<i32>) -> Vec<i32> {
    let mut clone: Vec<i32> = arr.clone(); //arr.into_serde().unwrap();

    clone.push(69);

    return clone; //JsValue::from_serde(&clone).unwrap();
}

#[wasm_bindgen]
pub fn sum(arr: Vec<i32>) -> i32 {
    let a = arr.into_iter().reduce(|a, b| a + b).unwrap();

    return a;
}
