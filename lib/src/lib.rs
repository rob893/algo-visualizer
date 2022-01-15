use priority_queue::priority_queue::PriorityQueue;
use serde::Serialize;
use std::{
    collections::{HashMap, VecDeque},
    hash::Hash,
};
use wasm_bindgen::{prelude::*, JsCast};

mod priority_queue;

#[wasm_bindgen(typescript_custom_section)]
const IPATH_RESPONSE: &'static str = r#"
interface INode {
    x: number;
    y: number;
    weight: number;
    passable: boolean;
}

interface IPathResponse {
    path: INode[];
    processed: INode[];
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "IPathResponse")]
    pub type IPathResponse;
}

#[wasm_bindgen]
pub enum PathFindingAlgorithm {
    Astar,
    Dijkstra,
}

#[wasm_bindgen]
#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq, Default, Hash)]
pub struct Node {
    pub x: u32,
    pub y: u32,
    pub weight: u32,
    pub passable: bool,
}

#[derive(Serialize, Debug)]
pub struct PathResult {
    pub path: Vec<Node>,
    pub processed: Vec<Node>,
}

#[wasm_bindgen]
pub struct Universe {
    pub width: u32,
    pub height: u32,
    nodes: Vec<Node>,
}

impl Universe {
    fn get_index(&self, x: u32, y: u32) -> usize {
        (y * self.width + x) as usize
    }

    fn get_cell_ref(&self, x: u32, y: u32) -> &Node {
        let index = self.get_index(x, y);
        return &self.nodes[index];
    }

    fn dijkstra(&self, start_x: u32, start_y: u32, end_x: u32, end_y: u32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier: VecDeque<&Node> = VecDeque::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut times: HashMap<&Node, i32> = HashMap::new();
        let mut came_from: HashMap<&Node, &Node> = HashMap::new();

        for node in &self.nodes {
            times.insert(node, i32::MAX);
        }

        times.insert(start_node, 0);
        frontier.push_back(start_node);

        while frontier.len() > 0 {
            let current = frontier.pop_front().unwrap();
            result.processed.push(current.clone());

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for neighbor in self.get_neighbors(current.x, current.y) {
                let prev_time = times.get(current).unwrap();
                let new_time = *prev_time + neighbor.weight as i32;

                if new_time < *times.get(neighbor).unwrap() {
                    times.insert(neighbor, new_time);
                    came_from.insert(neighbor, current);
                    frontier.push_back(neighbor);
                }
            }
        }

        return result;
    }

    fn astar(&self, start_x: u32, start_y: u32, end_x: u32, end_y: u32) -> PathResult {
        let mut result: PathResult = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&Node, &Node> = HashMap::new();
        let mut cost_so_far: HashMap<&Node, i32> = HashMap::new();

        let mut frontier: PriorityQueue<&Node> = PriorityQueue::new();

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
                    cost_so_far.insert(next, new_cost);
                    let priority = -1 * (new_cost + Universe::heuristic(next, end_node));
                    frontier.enqueue(next, priority);
                    came_from.insert(next, current);
                }
            }
        }

        return result;
    }

    fn get_neighbors(&self, x: u32, y: u32) -> Vec<&Node> {
        let mut vec: Vec<&Node> = Vec::with_capacity(4);

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
        let distance_x = (a.x as i32 - b.x as i32).abs();
        let distance_y = (a.y as i32 - b.y as i32).abs();

        return (distance_x * distance_x) + (distance_y * distance_y);
    }
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Self {
        let mut nodes: Vec<Node> = Vec::with_capacity((width * height) as usize);

        for y in 0..height {
            for x in 0..width {
                nodes.push(Node {
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
            nodes,
        };
    }

    pub fn reset(&mut self) {
        for node in &mut self.nodes {
            node.weight = 0;
            node.passable = true;
        }
    }

    #[wasm_bindgen(js_name = getCell)]
    pub fn get_cell(&self, x: u32, y: u32) -> Node {
        let index = self.get_index(x, y);
        return self.nodes[index];
    }

    #[wasm_bindgen(js_name = findPath)]
    pub fn find_path(
        &self,
        start_x: u32,
        start_y: u32,
        end_x: u32,
        end_y: u32,
        algorithm: PathFindingAlgorithm,
    ) -> IPathResponse {
        let path = match algorithm {
            PathFindingAlgorithm::Dijkstra => self.dijkstra(start_x, start_y, end_x, end_y),
            PathFindingAlgorithm::Astar => self.astar(start_x, start_y, end_x, end_y),
        };

        return JsValue::from_serde(&path).unwrap().unchecked_into();
    }

    #[wasm_bindgen(js_name = setWeight)]
    pub fn set_weight(&mut self, x: u32, y: u32, weight: u32) {
        let index = self.get_index(x, y);
        self.nodes[index].weight = weight;
    }

    #[wasm_bindgen(js_name = setPassable)]
    pub fn set_passable(&mut self, x: u32, y: u32, passable: bool) {
        let index = self.get_index(x, y);
        self.nodes[index].passable = passable;
    }
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

        let mut universe = Universe::new(grid_w[0].len() as u32, grid_w.len() as u32);

        assert_eq!(universe.nodes.len(), grid_w[0].len() * grid_w.len());

        for y in 0..grid_w.len() {
            for x in 0..grid_w[y].len() {
                match grid_w[y][x] {
                    n if n == w => universe.set_passable(x as u32, y as u32, false),
                    n if n == h => universe.set_weight(x as u32, y as u32, n as u32),
                    _ => {}
                }
            }
        }

        let path = universe.astar(0, 0, 4, 3);
        println!("visited {}", path.processed.len());
        assert_eq!(path.path.len(), 10);
    }
}
