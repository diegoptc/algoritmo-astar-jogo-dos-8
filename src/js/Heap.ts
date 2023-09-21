export class Heap<T> {
  public heap: T[] = [];
  private compare: (parentNode: T, node: T) => boolean;

  constructor(compare: (parentNode: T, node: T) => boolean) {
    this.compare = compare;
  }

  private getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  private hasParent(childIndex: number) {
    return this.getParentIndex(childIndex) >= 0;
  }

  private parent(childIndex: number) {
    return this.heap[this.getParentIndex(childIndex)];
  }

  private swap(indexOne: number, indexTwo: number) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  private heapifyUp() {
    let index = this.heap.length - 1;
    while(this.hasParent(index) && this.compare(this.parent(index), this.heap[index])) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  add(node: T) {
    this.heap.push(node);
    this.heapifyUp();
  }
}