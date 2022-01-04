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
pub struct Node {
    pub id: String,
    pub x: u32,
    pub y: u32,
    pub weight: u32,
    pub passable: bool,
}

#[derive(Serialize, Deserialize)]
pub struct PathResult {
    pub path: Vec<String>,
    pub processed: Vec<String>,
}

#[wasm_bindgen]
pub fn find_path(cols: u32, rows: u32, nodes: &JsValue) -> JsValue {
    let nodes: Vec<Node> = nodes.into_serde().unwrap();
    let grid = get_grid(nodes, cols, rows);

    //let grid = get_grid(edges, &mut grid);

    return JsValue::from_serde(&grid).unwrap();
}

//fn get_neighbors(grid: &Vec<Vec<u32>>, x: usize, y: usize) -> Vec<>

// fn setup_grid(edges: &Vec<Node>, grid: &mut Vec<Vec<u32>>) {
//     for edge in edges {
//         let (sx, sy) = get_x_y(&edge.id);

//         grid[sy as usize][sx as usize] = edge.weight;
//     }
// }

fn get_grid(nodes: Vec<Node>, cols: u32, rows: u32) -> Vec<Vec<Node>> {
    let mut grid: Vec<Vec<Node>> = Vec::with_capacity(cols as usize);

    for i in 0..cols {
        grid.push(Vec::with_capacity(rows as usize));

        for _ in 0..rows {
            grid[i as usize].push(Node::default());
        }
    }

    for node in nodes {
        let Node { x, y, .. } = node;
        grid[y as usize][x as usize] = node;
    }

    return grid;
}

// fn get_x_y(key: &str) -> (u32, u32) {
//     let split: Vec<&str> = key.split(',').collect();
//     let x: u32 = split[0].parse().unwrap();
//     let y: u32 = split[1].parse().unwrap();

//     return (x, y);
// }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let nodes = vec![
            Node {
                id: "1".to_string(),
                x: 0,
                y: 0,
                weight: 0,
                passable: true,
            },
            Node {
                id: "1".to_string(),
                x: 1,
                y: 0,
                weight: 0,
                passable: true,
            },
        ];

        let grid = get_grid(nodes, 3, 3);

        assert_eq!(grid.len(), 3);
    }
}
