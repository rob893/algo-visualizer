use priority_queue::priority_queue::PriorityQueue;
use serde::Serialize;
use std::{
    collections::{HashMap, HashSet, VecDeque},
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
    BFS,
    DFS,
    GreedyBFS,
}

#[wasm_bindgen]
#[derive(Serialize, Clone, Copy, Debug, PartialEq, Eq, Default, Hash)]
pub struct Node {
    pub x: i32,
    pub y: i32,
    pub weight: i32,
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
    fn get_index(&self, x: i32, y: i32) -> usize {
        (y * self.width as i32 + x) as usize
    }

    fn get_cell_ref(&self, x: i32, y: i32) -> &Node {
        let index = self.get_index(x, y);
        return &self.nodes[index];
    }

    fn bfs(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier: VecDeque<&Node> = VecDeque::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&Node, &Node> = HashMap::new();
        let mut visited: HashSet<&Node> = HashSet::new();

        frontier.push_back(start_node);
        visited.insert(start_node);

        while frontier.len() > 0 {
            let current = frontier.pop_front().unwrap();

            result.processed.push(current.clone());

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for neighbor in self.get_neighbors(current.x, current.y) {
                if !visited.contains(neighbor) {
                    visited.insert(neighbor);
                    came_from.insert(neighbor, current);
                    frontier.push_back(neighbor);
                }
            }
        }

        return result;
    }

    fn greedy_bfs(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier: PriorityQueue<&Node> = PriorityQueue::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&Node, &Node> = HashMap::new();
        let mut visited: HashSet<&Node> = HashSet::new();

        frontier.enqueue(start_node, 0);
        visited.insert(start_node);

        while frontier.count() > 0 {
            let current = frontier.dequeue().unwrap();

            result.processed.push(current.clone());

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for neighbor in self.get_neighbors(current.x, current.y) {
                if !visited.contains(neighbor) {
                    visited.insert(neighbor);
                    came_from.insert(neighbor, current);
                    frontier.enqueue(
                        neighbor,
                        -1 * (Universe::heuristic(neighbor, end_node) + neighbor.weight),
                    );
                }
            }
        }

        return result;
    }

    fn dfs(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier: Vec<&Node> = Vec::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&Node, &Node> = HashMap::new();
        let mut visited: HashSet<&Node> = HashSet::new();

        frontier.push(start_node);

        while frontier.len() > 0 {
            let current = frontier.pop().unwrap();

            result.processed.push(current.clone());
            visited.insert(current);

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for neighbor in self.get_neighbors(current.x, current.y) {
                if !visited.contains(neighbor) {
                    came_from.insert(neighbor, current);
                    frontier.push(neighbor);
                }
            }
        }

        return result;
    }

    // fn get_closest_node(nodes: &Vec<&Node>, times: &HashMap<&Node, i32>) -> usize { // Used for vec impl
    //     let mut curr_closest_index = 0;

    //     for i in 0..nodes.len() {
    //         if times.get(nodes[curr_closest_index]).unwrap_or(&i32::MAX)
    //             > times.get(nodes[i]).unwrap_or(&i32::MAX)
    //         {
    //             curr_closest_index = i;
    //         }
    //     }

    //     return curr_closest_index;
    // }

    fn dijkstra(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        // let mut frontier: Vec<&Node> = self.nodes.iter().collect(); // Used for vec impl
        let mut frontier: PriorityQueue<&Node> = PriorityQueue::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut times: HashMap<&Node, i32> = HashMap::new();
        let mut came_from: HashMap<&Node, &Node> = HashMap::new();

        times.insert(start_node, 0);
        frontier.enqueue(start_node, 0);

        while frontier.count() > 0 {
            // let index = Universe::get_closest_node(&frontier, &times); // Used for vec impl
            // let current = frontier.swap_remove(index);
            let current = frontier.dequeue().unwrap();

            result.processed.push(current.clone());

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for neighbor in self.get_neighbors(current.x, current.y) {
                let prev_time = times.get(current).unwrap();
                let new_time = *prev_time + neighbor.weight + 1;

                if new_time < *times.get(neighbor).unwrap_or(&i32::MAX) {
                    times.insert(neighbor, new_time);
                    came_from.insert(neighbor, current);
                    frontier.enqueue(neighbor, -1 * new_time);
                }
            }
        }

        return result;
    }

    fn astar(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result: PathResult = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&Node, &Node> = HashMap::new();
        let mut g_score: HashMap<&Node, i32> = HashMap::new();

        g_score.insert(start_node, 0);

        let mut frontier: PriorityQueue<&Node> = PriorityQueue::new();

        frontier.enqueue(start_node, 0);

        while frontier.count() > 0 {
            let current = frontier.dequeue().unwrap();
            result.processed.push(current.clone());

            if current == end_node {
                return Universe::construct_path(result, came_from, end_node);
            }

            for next in self.get_neighbors(current.x, current.y) {
                let tentative_g_score = 1 + *g_score.get(current).unwrap() + next.weight as i32;

                if tentative_g_score < *g_score.get(next).unwrap_or(&i32::MAX) {
                    g_score.insert(next, tentative_g_score);
                    let f_score = -1 * (tentative_g_score + Universe::heuristic(next, end_node));
                    frontier.enqueue(next, f_score);
                    came_from.insert(next, current);
                }
            }
        }

        return result;
    }

    fn get_neighbors(&self, x: i32, y: i32) -> Vec<&Node> {
        let mut vec: Vec<&Node> = Vec::with_capacity(4);

        if y > 0 && self.get_cell_ref(x, y - 1).passable {
            vec.push(self.get_cell_ref(x, y - 1));
        }

        if y < self.height as i32 - 1 && self.get_cell_ref(x, y + 1).passable {
            vec.push(self.get_cell_ref(x, y + 1));
        }

        if x > 0 && self.get_cell_ref(x - 1, y).passable {
            vec.push(self.get_cell_ref(x - 1, y));
        }

        if x < self.width as i32 - 1 && self.get_cell_ref(x + 1, y).passable {
            vec.push(self.get_cell_ref(x + 1, y));
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
        let distance_x = (a.x - b.x).abs();
        let distance_y = (a.y - b.y).abs();

        return distance_x + distance_y;
    }
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Self {
        let mut nodes: Vec<Node> = Vec::with_capacity((width * height) as usize);

        for y in 0..height as i32 {
            for x in 0..width as i32 {
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

    pub fn resize(&mut self, width: u32, height: u32) {
        let mut nodes: Vec<Node> = Vec::with_capacity((width * height) as usize);

        for y in 0..height as i32 {
            for x in 0..width as i32 {
                nodes.push(Node {
                    x,
                    y,
                    weight: 0,
                    passable: true,
                })
            }
        }

        self.width = width;
        self.height = height;
        self.nodes = nodes;
    }

    pub fn reset(&mut self) {
        for node in &mut self.nodes {
            node.weight = 0;
            node.passable = true;
        }
    }

    #[wasm_bindgen(js_name = getCell)]
    pub fn get_cell(&self, x: i32, y: i32) -> Node {
        let index = self.get_index(x, y);
        return self.nodes[index];
    }

    #[wasm_bindgen(js_name = findPath)]
    pub fn find_path(
        &self,
        start_x: i32,
        start_y: i32,
        end_x: i32,
        end_y: i32,
        algorithm: PathFindingAlgorithm,
    ) -> IPathResponse {
        let path = match algorithm {
            PathFindingAlgorithm::Dijkstra => self.dijkstra(start_x, start_y, end_x, end_y),
            PathFindingAlgorithm::Astar => self.astar(start_x, start_y, end_x, end_y),
            PathFindingAlgorithm::BFS => self.bfs(start_x, start_y, end_x, end_y),
            PathFindingAlgorithm::DFS => self.dfs(start_x, start_y, end_x, end_y),
            PathFindingAlgorithm::GreedyBFS => self.greedy_bfs(start_x, start_y, end_x, end_y),
        };

        return JsValue::from_serde(&path).unwrap().unchecked_into();
    }

    #[wasm_bindgen(js_name = setWeight)]
    pub fn set_weight(&mut self, x: i32, y: i32, weight: i32) {
        let index = self.get_index(x, y);
        self.nodes[index].weight = weight;
    }

    #[wasm_bindgen(js_name = setPassable)]
    pub fn set_passable(&mut self, x: i32, y: i32, passable: bool) {
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
                    n if n == w => universe.set_passable(x as i32, y as i32, false),
                    n if n == h => universe.set_weight(x as i32, y as i32, n as i32),
                    _ => {}
                }
            }
        }

        let path = universe.astar(0, 0, 4, 3);
        println!("visited {}", path.processed.len());
        assert_eq!(path.path.len(), 10);
    }
}
