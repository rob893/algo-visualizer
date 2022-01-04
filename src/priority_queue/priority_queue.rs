use std::collections::BinaryHeap;

use super::priority_queue_item::PriorityQueueItem;

pub struct PriorityQueue<T> {
    heap: BinaryHeap<PriorityQueueItem<T>>,
}

impl<T> PriorityQueue<T>
where
    T: Eq,
{
    pub fn new() -> Self {
        Self {
            heap: BinaryHeap::new(),
        }
    }

    pub fn with_capacity(cap: usize) -> Self {
        Self {
            heap: BinaryHeap::with_capacity(cap),
        }
    }

    pub fn count(&self) -> usize {
        self.heap.len()
    }

    pub fn is_empty(&self) -> bool {
        self.heap.is_empty()
    }

    pub fn enqueue(&mut self, item: T, priority: u32) {
        self.heap.push(PriorityQueueItem { item, priority })
    }

    pub fn dequeue(&mut self) -> Option<T> {
        match self.heap.pop() {
            Some(item) => Some(item.item),
            None => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn priority_queue() {
        let mut queue: PriorityQueue<u32> = PriorityQueue::new();

        assert_eq!(queue.count(), 0);
        assert_eq!(queue.is_empty(), true);

        queue.enqueue(5, 1);
        queue.enqueue(8, 3);
        queue.enqueue(29, 2);

        assert_eq!(queue.count(), 3);
        assert_eq!(queue.is_empty(), false);

        assert_eq!(queue.dequeue(), Some(8));
        assert_eq!(queue.dequeue(), Some(29));
        assert_eq!(queue.dequeue(), Some(5));
        assert_eq!(queue.dequeue(), None);
    }
}
