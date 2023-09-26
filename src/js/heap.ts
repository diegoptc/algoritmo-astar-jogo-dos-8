export class Heap<T> {
  public heap: T[] = [];
  private compare: (nodeOne: T, nodeTwo: T) => boolean;

  constructor(compare: (nodeOne: T, nodeTwo: T) => boolean) {
    this.compare = compare;
  }

  length() {
    return this.heap.length;
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

  private getLeftChildIndex(parentIndex: number) {
    return 2 * parentIndex + 1
  }

  private getRightChildIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }

  private hasLeftChild(parentIndex: number) {
    return this.getLeftChildIndex(parentIndex) < this.length();
  }

  private hasRightChild(parentIndex: number) {
    return this.getRightChildIndex(parentIndex) < this.length();
  }

  private leftChild(parentIndex: number) {
    return this.heap[this.getLeftChildIndex(parentIndex)];
  }

  private rightChild(parentIndex: number) {
    return this.heap[this.getRightChildIndex(parentIndex)];
  }

  private swap(indexOne: number, indexTwo: number) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  private heapifyUp() {
    let index = this.length() - 1;
    while(this.hasParent(index) && this.compare(this.parent(index), this.heap[index])) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && this.compare(this.leftChild(index), this.rightChild(index))) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.compare(this.heap[smallerChildIndex], this.heap[index])) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  add(node: T) {
    this.heap.push(node);
    this.heapifyUp();
  }

  remove() {
    const item = this.heap[0];
    this.heap[0] = this.heap[this.length() - 1]
    this.heap.pop();
    this.heapifyDown();
    return item;
  }
  
}