use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct GridSnapshot {
    pub width: i32,
    pub height: i32,
    pub weight: i32,
    pub walls: Vec<String>,
    pub weights: Vec<String>,
}
