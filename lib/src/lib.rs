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

#[wasm_bindgen]
#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq, Default, Hash)]
pub struct Cell {
    pub x: u32,
    pub y: u32,
    pub weight: u32,
    pub passable: bool,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

impl Universe {
    fn get_index(&self, x: u32, y: u32) -> usize {
        (y * self.width + x) as usize
    }

    fn get_cell_ref(&self, x: u32, y: u32) -> &Cell {
        let index = self.get_index(x, y);
        return &self.cells[index];
    }

    fn astar(&self, start_x: u32, start_y: u32, end_x: u32, end_y: u32) -> PathResult<Cell> {
        let mut result: PathResult<Cell> = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&Cell, &Cell> = HashMap::new();
        let mut cost_so_far: HashMap<&Cell, i32> = HashMap::new();

        let mut frontier: PriorityQueue<&Cell> = PriorityQueue::new();

        frontier.enqueue(start_node, 0);

        cost_so_far.insert(start_node, 0);

        while frontier.count() > 0 {
            let current = frontier.dequeue().unwrap();
            result.processed.push(current.clone());

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for next in self.get_neighbors(current.x, current.y) {
                let current_cost = cost_so_far.get(current).unwrap();
                let new_cost = current_cost + next.weight as i32;
                let next_cost = cost_so_far.get(next);

                if next_cost == None || new_cost < *next_cost.unwrap() {
                    result.processed.push(next.clone());
                    cost_so_far.insert(next, new_cost);
                    let priority = -1 * (new_cost + Universe::heuristic(next, end_node));
                    frontier.enqueue(next, priority);
                    came_from.insert(next, current);
                }
            }
        }

        return result;
    }

    fn get_neighbors(&self, x: u32, y: u32) -> Vec<&Cell> {
        let mut vec: Vec<&Cell> = Vec::with_capacity(4);

        if x > 0 && self.get_cell_ref(x - 1, y).passable {
            vec.push(self.get_cell_ref(x - 1, y));
        }

        if x < self.width - 1 && self.get_cell_ref(x + 1, y).passable {
            vec.push(self.get_cell_ref(x + 1, y));
        }

        if y > 0 && self.get_cell_ref(x, y - 1).passable {
            vec.push(self.get_cell_ref(x, y - 1));
        }

        if y < self.height - 1 && self.get_cell_ref(x, y + 1).passable {
            vec.push(self.get_cell_ref(x, y + 1));
        }

        return vec;
    }

    fn construct_path(
        mut result: PathResult<Cell>,
        came_from: HashMap<&Cell, &Cell>,
        end_node: &Cell,
    ) -> PathResult<Cell> {
        let mut current = end_node;
        result.path.push(current.clone());

        while let Some(next) = came_from.get(current) {
            current = next;
            result.path.push(current.clone());
        }

        result.path.reverse();

        return result;
    }

    fn heuristic(a: &Cell, b: &Cell) -> i32 {
        let distance_x = a.x as i32 - b.x as i32;
        let distance_y = a.y as i32 - b.y as i32;

        return (distance_x * distance_x) + (distance_y * distance_y);
    }
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Self {
        let mut cells: Vec<Cell> = Vec::with_capacity((width * height) as usize);

        for y in 0..height {
            for x in 0..width {
                cells.push(Cell {
                    x,
                    y,
                    weight: 0,
                    passable: true,
                })
            }
        }

        return Universe {
            width,
            height,
            cells,
        };
    }

    pub fn get_cell(&self, x: u32, y: u32) -> Cell {
        let index = self.get_index(x, y);
        return self.cells[index];
    }

    pub fn find_path(&self, start_x: u32, start_y: u32, end_x: u32, end_y: u32) -> JsValue {
        let path = self.astar(start_x, start_y, end_x, end_y);

        return JsValue::from_serde(&path).unwrap();
    }

    pub fn set_weight(&mut self, x: u32, y: u32, weight: u32) {
        let index = self.get_index(x, y);
        self.cells[index].weight = weight;
    }
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
pub struct PathResult<T = Node> {
    pub path: Vec<T>,
    pub processed: Vec<T>,
}

#[wasm_bindgen]
pub fn find_path(start_x: u32, start_y: u32, end_x: u32, end_y: u32, nodes: &JsValue) -> JsValue {
    let grid: Vec<Vec<Node>> = nodes.into_serde().unwrap();

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn astar_works() {
        let w: i32 = -1;
        let h = 1000;

        let grid_w = [
            [0, 0, w, 0, 0],
            [0, 0, w, 0, 0],
            [0, 0, w, 0, 0],
            [0, 0, h, 0, 0],
            [0, 0, 0, 0, 0],
        ];

        let mut grid: Vec<Vec<Node>> = Vec::new();

        for y in 0..grid_w.len() {
            grid.push(Vec::new());
            for x in 0..grid_w[y].len() {
                grid[y].push(Node {
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

        //let grid = get_grid(nodes, grid_w.len() as u32, grid_w[0].len() as u32);

        assert_eq!(grid.len(), 5);

        let path = astar(grid, 0, 0, 4, 3);
        assert_eq!(path.path.len(), 10);
    }
}
