use serde::Serialize;

use super::GridNode;

#[derive(Serialize, Debug)]
pub struct PathResult {
    pub path: Vec<GridNode>,
    pub processed: Vec<GridNode>,
}
