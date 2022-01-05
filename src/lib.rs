use std::collections::HashMap;

use priority_queue::priority_queue::PriorityQueue;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

mod priority_queue;

#[wasm_bindgen]
pub fn fib(n: u32) -> u32 {
    if n <= 2 {
        return 1;
    }

    return fib(n - 1) + fib(n - 2);
}

#[wasm_bindgen]
pub fn test(arr: Vec<i32>) -> Vec<i32> {
    let mut clone: Vec<i32> = arr.clone();

    clone.push(69);

    return clone;
}

#[wasm_bindgen]
pub fn sum(arr: Vec<i32>) -> i32 {
    let a = arr.into_iter().reduce(|a, b| a + b).unwrap();

    return a;
}

#[derive(Serialize, Deserialize, Clone, Default, Debug, PartialEq, Eq, Hash)]
pub struct Node {
    pub id: String,
    pub x: u32,
    pub y: u32,
    pub weight: u32,
    pub passable: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PathResult {
    pub path: Vec<Node>,
    pub processed: Vec<Node>,
}

#[wasm_bindgen]
pub fn find_path(
    cols: u32,
    rows: u32,
    start_x: u32,
    start_y: u32,
    end_x: u32,
    end_y: u32,
    nodes: &JsValue,
) -> JsValue {
    let nodes: Vec<Node> = nodes.into_serde().unwrap();
    let grid = get_grid(nodes, cols, rows);

    let path = astar(grid, start_x, start_y, end_x, end_y);

    return JsValue::from_serde(&path).unwrap();
}

fn astar(grid: Vec<Vec<Node>>, start_x: u32, start_y: u32, end_x: u32, end_y: u32) -> PathResult {
    let mut result = PathResult {
        path: Vec::new(),
        processed: Vec::new(),
    };

    let start_node = &grid[start_y as usize][start_x as usize];
    let end_node = &grid[end_y as usize][end_x as usize];

    let mut came_from: HashMap<&Node, &Node> = HashMap::new();
    let mut cost_so_far: HashMap<&Node, i32> = HashMap::new();

    let mut frontier: PriorityQueue<&Node> = PriorityQueue::new();

    frontier.enqueue(start_node, 0);

    cost_so_far.insert(start_node, 0);

    while frontier.count() > 0 {
        let current = frontier.dequeue().unwrap();
        result.processed.push(current.clone());

        if current == end_node {
            return construct_path(result, came_from, end_node);
        }

        for next in get_neighbors(&grid, current.x as usize, current.y as usize) {
            let current_cost = cost_so_far.get(current).unwrap();
            let new_cost = current_cost + next.weight as i32;
            let next_cost = cost_so_far.get(next);

            if next_cost == None || new_cost < *next_cost.unwrap() {
                result.processed.push(next.clone());
                cost_so_far.insert(next, new_cost);
                let priority = -1 * (new_cost + heuristic(next, end_node));
                frontier.enqueue(next, priority);
                came_from.insert(next, current);
            }
        }
    }

    return result;
}

fn construct_path(
    mut result: PathResult,
    came_from: HashMap<&Node, &Node>,
    end_node: &Node,
) -> PathResult {
    let mut current = end_node;
    result.path.push(current.clone());

    while let Some(next) = came_from.get(current) {
        current = next;
        result.path.push(current.clone());
    }

    result.path.reverse();

    return result;
}

fn heuristic(a: &Node, b: &Node) -> i32 {
    let distance_x = a.x as i32 - b.x as i32;
    let distance_y = a.y as i32 - b.y as i32;

    return (distance_x * distance_x) + (distance_y * distance_y);
}

fn get_neighbors(grid: &Vec<Vec<Node>>, x: usize, y: usize) -> Vec<&Node> {
    let mut vec: Vec<&Node> = Vec::with_capacity(4);

    if x > 0 && grid[y][x - 1].passable {
        vec.push(&grid[y][x - 1]);
    }

    if x < grid[y].len() - 1 && grid[y][x + 1].passable {
        vec.push(&grid[y][x + 1]);
    }

    if y > 0 && grid[y - 1][x].passable {
        vec.push(&grid[y - 1][x]);
    }

    if y < grid.len() - 1 && grid[y + 1][x].passable {
        vec.push(&grid[y + 1][x]);
    }

    return vec;
}

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let w: i32 = -1;
        let h = 1000;

        let grid_w = [
            [0, 0, w, 0, 0],
            [0, 0, w, 0, 0],
            [0, 0, w, 0, 0],
            [0, 0, h, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        let mut nodes: Vec<Node> = Vec::new();

        for y in 0..grid_w.len() {
            for x in 0..grid_w[y].len() {
                nodes.push(Node {
                    id: format!("{},{}", x, y),
                    x: x as u32,
                    y: y as u32,
                    weight: if grid_w[y][x] == -1 {
                        1000
                    } else {
                        grid_w[y][x] as u32
                    },
                    passable: if grid_w[y][x] == -1 { false } else { true },
                });
            }
        }

        let grid = get_grid(nodes, grid_w.len() as u32, grid_w[0].len() as u32);

        assert_eq!(grid.len(), 5);

        let path = astar(grid, 0, 0, 4, 3);
        assert_eq!(path.path.len(), 3);
    }
}
