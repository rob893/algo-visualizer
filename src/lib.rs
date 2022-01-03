use std::collections::HashMap;

use serde::{Deserialize, Serialize};
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

#[derive(Serialize, Deserialize, Clone, Default, Debug)]
pub struct Edge {
    pub start: String,
    pub end: String,
    pub weight: u32,
}

#[derive(Serialize, Deserialize)]
pub struct PathResult {
    pub path: Vec<String>,
    pub processed: Vec<String>,
}

#[wasm_bindgen]
pub fn find_path(cols: u32, rows: u32, edges: &JsValue) -> JsValue {
    let edges: Vec<Edge> = edges.into_serde().unwrap();
    let mut grid = get_grid(cols, rows);

    setup_grid(&edges, &mut grid);

    return JsValue::from_serde(&grid).unwrap();
}

fn setup_grid(edges: &Vec<Edge>, grid: &mut Vec<Vec<HashMap<String, u32>>>) {
    for edge in edges {
        let (sx, sy) = get_x_y(&edge.start);

        grid[sy as usize][sx as usize].insert(edge.end.clone(), edge.weight);
    }
}

fn get_grid(cols: u32, rows: u32) -> Vec<Vec<HashMap<String, u32>>> {
    let mut grid: Vec<Vec<HashMap<String, u32>>> = Vec::with_capacity(cols as usize);

    for i in 0..cols {
        grid.push(Vec::with_capacity(rows as usize));

        for _ in 0..rows {
            grid[i as usize].push(HashMap::new());
        }
    }

    return grid;
}

fn get_x_y(key: &str) -> (u32, u32) {
    let split: Vec<&str> = key.split(',').collect();
    let x: u32 = split[0].parse().unwrap();
    let y: u32 = split[1].parse().unwrap();

    return (x, y);
}
