#[derive(Eq, Debug)]
pub struct PriorityQueueItem<T> {
    pub item: T,
    pub priority: i32,
}

impl<T> PartialEq for PriorityQueueItem<T> {
    fn eq(&self, other: &Self) -> bool {
        self.priority.eq(&other.priority)
    }
}

impl<T> PartialOrd for PriorityQueueItem<T> {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.priority.partial_cmp(&other.priority)
    }
}

impl<T> Ord for PriorityQueueItem<T>
where
    T: Eq,
{
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.priority.cmp(&other.priority)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn priority_queue_item() {
        let item_1 = PriorityQueueItem {
            item: 5,
            priority: 10,
        };
        let item_2 = PriorityQueueItem {
            item: 10,
            priority: 5,
        };
        let item_3 = PriorityQueueItem {
            item: 10,
            priority: 10,
        };

        assert_eq!(item_1 > item_2, true);
        assert_eq!(item_1 == item_3, true);
    }
}
