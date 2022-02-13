use rand::Rng;
use std::collections::{HashMap, HashSet, VecDeque};
use wasm_bindgen::{prelude::wasm_bindgen, JsCast, JsValue};

use crate::{IMazeResponse, IPathResponse, PriorityQueue};

use super::{GridNode, MazeType, Orientation, PathFindingAlgorithm, PathResult};

#[wasm_bindgen]
pub struct Universe {
    pub width: u32,
    pub height: u32,
    nodes: Vec<GridNode>,
}

#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Self {
        let mut nodes: Vec<GridNode> = Vec::with_capacity((width * height) as usize);

        for y in 0..height as i32 {
            for x in 0..width as i32 {
                nodes.push(GridNode {
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
        let mut nodes: Vec<GridNode> = Vec::with_capacity((width * height) as usize);

        for y in 0..height as i32 {
            for x in 0..width as i32 {
                nodes.push(GridNode {
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
    pub fn get_cell(&self, x: i32, y: i32) -> GridNode {
        let index = self.get_index(x, y);
        return self.nodes[index];
    }

    #[wasm_bindgen(js_name = generateMaze)]
    pub fn generate_maze(&self, maze_type: MazeType) -> IMazeResponse {
        let mut maze: Vec<GridNode> = Vec::new();
        match maze_type {
            MazeType::Random25 => self.random_nodes(&mut maze, 25),
            MazeType::Random50 => self.random_nodes(&mut maze, 50),
            MazeType::Random75 => self.random_nodes(&mut maze, 75),
            MazeType::RecursiveDivision => self.recursive_division_maze(
                &mut maze,
                2,
                self.height as i32 - 3,
                2,
                self.width as i32 - 3,
                Orientation::Horizontal,
                true,
            ),
        };

        return JsValue::from_serde(&maze).unwrap().unchecked_into();
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
            PathFindingAlgorithm::AstarBidirectional => {
                self.astar_bidirectional(start_x, start_y, end_x, end_y)
            }
            PathFindingAlgorithm::BFS => self.bfs(start_x, start_y, end_x, end_y),
            PathFindingAlgorithm::BFSBidirectional => {
                self.bfs_bidirectional(start_x, start_y, end_x, end_y)
            }
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

impl Universe {
    fn get_index(&self, x: i32, y: i32) -> usize {
        (y * self.width as i32 + x) as usize
    }

    fn get_cell_ref(&self, x: i32, y: i32) -> &GridNode {
        let index = self.get_index(x, y);
        return &self.nodes[index];
    }

    fn random_nodes<'a>(&self, result: &'a mut Vec<GridNode>, percentage: i32) {
        let mut rng = rand::thread_rng();

        for node in &self.nodes {
            let rand = rng.gen_range(0..100);

            if rand < percentage {
                result.push(node.clone());
            }
        }
    }

    fn recursive_division_maze<'a>(
        &self,
        result: &'a mut Vec<GridNode>,
        row_start: i32,
        row_end: i32,
        col_start: i32,
        col_end: i32,
        orientation: Orientation,
        surrounding_walls: bool,
    ) {
        if row_end < row_start || col_end < col_start {
            return;
        }

        if surrounding_walls {
            for row in 0..self.height as i32 {
                let left_node = self.get_cell(0, row).clone();
                let right_node = self.get_cell((self.width - 1) as i32, row).clone();

                result.push(left_node);
                result.push(right_node);
            }

            for col in 0..self.width as i32 {
                let top_node = self.get_cell(col, 0).clone();
                let bottom_node = self.get_cell(col, (self.height - 1) as i32).clone();

                result.push(top_node);
                result.push(bottom_node);
            }
        }

        let mut possible_rows: Vec<i32> = Vec::new();

        for i in (if orientation == Orientation::Horizontal {
            row_start
        } else {
            row_start - 1
        }..if orientation == Orientation::Horizontal {
            row_end + 1
        } else {
            row_end + 2
        })
            .step_by(2)
        {
            possible_rows.push(i);
        }

        let mut possible_cols: Vec<i32> = Vec::new();

        for i in (if orientation == Orientation::Horizontal {
            col_start - 1
        } else {
            col_start
        }..if orientation == Orientation::Horizontal {
            col_end + 2
        } else {
            col_end + 1
        })
            .step_by(2)
        {
            possible_cols.push(i);
        }

        let mut rng = rand::thread_rng();

        let rand_row_index = rng.gen_range(0..possible_rows.len());
        let rand_col_index = rng.gen_range(0..possible_cols.len());

        let rand_row = possible_rows[rand_row_index];
        let rand_col = possible_cols[rand_col_index];

        if orientation == Orientation::Horizontal {
            for col in 0..self.width as i32 {
                if col != rand_col && col >= col_start - 1 && col <= col_end + 1 {
                    let node = self.get_cell(col as i32, rand_row as i32).clone();
                    result.push(node);
                }
            }

            if rand_row - 2 - row_start > col_end - col_start {
                self.recursive_division_maze(
                    result,
                    row_start,
                    rand_row - 2,
                    col_start,
                    col_end,
                    orientation,
                    false,
                );
            } else {
                self.recursive_division_maze(
                    result,
                    row_start,
                    rand_row - 2,
                    col_start,
                    col_end,
                    Orientation::Vertical,
                    false,
                );
            }

            if row_end - (rand_row + 2) > col_end - col_start {
                self.recursive_division_maze(
                    result,
                    rand_row + 2,
                    row_end,
                    col_start,
                    col_end,
                    orientation,
                    false,
                );
            } else {
                self.recursive_division_maze(
                    result,
                    rand_row + 2,
                    row_end,
                    col_start,
                    col_end,
                    Orientation::Vertical,
                    false,
                );
            }
        } else {
            for row in 0..self.height as i32 {
                if row != rand_row && row >= row_start - 1 && row <= row_end + 1 {
                    let node = self.get_cell(rand_col as i32, row as i32).clone();
                    result.push(node);
                }
            }

            if row_end - row_start > rand_col - 2 - col_start {
                self.recursive_division_maze(
                    result,
                    row_start,
                    row_end,
                    col_start,
                    rand_col - 2,
                    Orientation::Horizontal,
                    false,
                );
            } else {
                self.recursive_division_maze(
                    result,
                    row_start,
                    row_end,
                    col_start,
                    rand_col - 2,
                    orientation,
                    false,
                );
            }

            if row_end - row_start > col_end - (rand_col + 2) {
                self.recursive_division_maze(
                    result,
                    row_start,
                    row_end,
                    rand_col + 2,
                    col_end,
                    Orientation::Horizontal,
                    false,
                );
            } else {
                self.recursive_division_maze(
                    result,
                    row_start,
                    row_end,
                    rand_col + 2,
                    col_end,
                    orientation,
                    false,
                );
            }
        }
    }

    fn bfs(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier: VecDeque<&GridNode> = VecDeque::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut visited: HashSet<&GridNode> = HashSet::new();

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

    fn bfs_bidirectional(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier_start: VecDeque<&GridNode> = VecDeque::new();
        let mut frontier_end: VecDeque<&GridNode> = VecDeque::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from_start: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut came_from_end: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut visited_start: HashSet<&GridNode> = HashSet::new();
        let mut visited_end: HashSet<&GridNode> = HashSet::new();

        frontier_start.push_back(start_node);
        frontier_end.push_back(end_node);
        visited_start.insert(start_node);
        visited_end.insert(end_node);

        while frontier_start.len() > 0 || frontier_end.len() > 0 {
            if frontier_start.len() > 0 {
                let current = frontier_start.pop_front().unwrap();
                result.processed.push(current.clone());

                if current == end_node {
                    return Universe::construct_path(result, came_from_start, end_node);
                }

                if came_from_end.contains_key(current) {
                    let mut here_end = Universe::construct_path(result, came_from_end, current);
                    here_end.path.pop();
                    let start_here = Universe::construct_path(here_end, came_from_start, current);

                    return start_here;
                }

                for neighbor in self.get_neighbors(current.x, current.y) {
                    if !visited_start.contains(neighbor) {
                        visited_start.insert(neighbor);
                        came_from_start.insert(neighbor, current);
                        frontier_start.push_back(neighbor);
                    }
                }
            }

            if frontier_end.len() > 0 {
                let current = frontier_end.pop_front().unwrap();
                result.processed.push(current.clone());

                if current == start_node {
                    return Universe::construct_path(result, came_from_end, start_node);
                }

                if came_from_start.contains_key(current) {
                    let mut here_end = Universe::construct_path(result, came_from_end, current);
                    here_end.path.pop();
                    let start_here = Universe::construct_path(here_end, came_from_start, current);

                    return start_here;
                }

                for neighbor in self.get_neighbors(current.x, current.y) {
                    if !visited_end.contains(neighbor) {
                        visited_end.insert(neighbor);
                        came_from_end.insert(neighbor, current);
                        frontier_end.push_back(neighbor);
                    }
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

        let mut frontier: PriorityQueue<&GridNode> = PriorityQueue::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut visited: HashSet<&GridNode> = HashSet::new();

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

        let mut frontier: Vec<&GridNode> = Vec::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut visited: HashSet<&GridNode> = HashSet::new();

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

    fn dijkstra(&self, start_x: i32, start_y: i32, end_x: i32, end_y: i32) -> PathResult {
        let mut result = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let mut frontier: PriorityQueue<&GridNode> = PriorityQueue::new();

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut times: HashMap<&GridNode, i32> = HashMap::new();
        let mut came_from: HashMap<&GridNode, &GridNode> = HashMap::new();

        times.insert(start_node, 0);
        frontier.enqueue(start_node, 0);

        while frontier.count() > 0 {
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

        let mut came_from: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut g_score: HashMap<&GridNode, i32> = HashMap::new();

        g_score.insert(start_node, 0);

        let mut frontier: PriorityQueue<&GridNode> = PriorityQueue::new();

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

    fn astar_bidirectional(
        &self,
        start_x: i32,
        start_y: i32,
        end_x: i32,
        end_y: i32,
    ) -> PathResult {
        let mut result: PathResult = PathResult {
            path: Vec::new(),
            processed: Vec::new(),
        };

        let start_node = self.get_cell_ref(start_x, start_y);
        let end_node = self.get_cell_ref(end_x, end_y);

        let mut came_from_start: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut came_from_end: HashMap<&GridNode, &GridNode> = HashMap::new();
        let mut g_score_start: HashMap<&GridNode, i32> = HashMap::new();
        let mut g_score_end: HashMap<&GridNode, i32> = HashMap::new();

        g_score_start.insert(start_node, 0);
        g_score_end.insert(end_node, 0);

        let mut frontier_start: PriorityQueue<&GridNode> = PriorityQueue::new();
        let mut frontier_end: PriorityQueue<&GridNode> = PriorityQueue::new();

        frontier_start.enqueue(start_node, 0);
        frontier_end.enqueue(end_node, 0);

        while frontier_start.count() > 0 || frontier_end.count() > 0 {
            if frontier_start.count() > 0 {
                let current = frontier_start.dequeue().unwrap();
                result.processed.push(current.clone());

                if current == end_node {
                    return Universe::construct_path(result, came_from_start, end_node);
                }

                if came_from_end.contains_key(current) {
                    let mut here_end = Universe::construct_path(result, came_from_end, current);
                    here_end.path.pop();
                    let start_here = Universe::construct_path(here_end, came_from_start, current);

                    return start_here;
                }

                for next in self.get_neighbors(current.x, current.y) {
                    let tentative_g_score =
                        1 + *g_score_start.get(current).unwrap() + next.weight as i32;

                    if tentative_g_score < *g_score_start.get(next).unwrap_or(&i32::MAX) {
                        g_score_start.insert(next, tentative_g_score);
                        let f_score =
                            -1 * (tentative_g_score + Universe::heuristic(next, end_node));
                        frontier_start.enqueue(next, f_score);
                        came_from_start.insert(next, current);
                    }
                }
            }

            if frontier_end.count() > 0 {
                let current = frontier_end.dequeue().unwrap();
                result.processed.push(current.clone());

                if current == start_node {
                    return Universe::construct_path(result, came_from_end, start_node);
                }

                if came_from_start.contains_key(current) {
                    let mut here_end = Universe::construct_path(result, came_from_end, current);
                    here_end.path.pop();
                    let start_here = Universe::construct_path(here_end, came_from_start, current);

                    return start_here;
                }

                for next in self.get_neighbors(current.x, current.y) {
                    let tentative_g_score =
                        1 + *g_score_end.get(current).unwrap() + next.weight as i32;

                    if tentative_g_score < *g_score_end.get(next).unwrap_or(&i32::MAX) {
                        g_score_end.insert(next, tentative_g_score);
                        let f_score =
                            -1 * (tentative_g_score + Universe::heuristic(next, start_node));
                        frontier_end.enqueue(next, f_score);
                        came_from_end.insert(next, current);
                    }
                }
            }
        }

        return result;
    }

    fn get_neighbors(&self, x: i32, y: i32) -> Vec<&GridNode> {
        let mut vec: Vec<&GridNode> = Vec::with_capacity(4);

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
        came_from: HashMap<&GridNode, &GridNode>,
        end_node: &GridNode,
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

    fn heuristic(a: &GridNode, b: &GridNode) -> i32 {
        let distance_x = (a.x - b.x).abs();
        let distance_y = (a.y - b.y).abs();

        return distance_x + distance_y;
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

    #[test]
    fn recursive_division_maze_works() {
        let h: i32 = 25;
        let w: i32 = 62;
        let universe = Universe::new(w as u32, h as u32);

        assert_eq!(universe.nodes.len(), (w * h) as usize);

        let mut maze: Vec<GridNode> = Vec::new();
        universe.recursive_division_maze(
            &mut maze,
            2,
            h - 3,
            2,
            w - 3,
            Orientation::Horizontal,
            true,
        );

        assert_eq!(maze.len() > 0, true);
    }
}
