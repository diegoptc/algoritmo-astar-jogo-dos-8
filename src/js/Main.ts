import { Heap } from "./Heap";
import * as _ from 'lodash';

export interface MatrixPosition {
  line: number;
  column: number;
}

export class State {
  gamePhase: number[][] = [];
  g: number = 0;
  parent: State | null = null;
  blankPosition: MatrixPosition = { line: 0, column: 0 };

  private swap(one: MatrixPosition, two: MatrixPosition) {
    const temp = this.gamePhase[one.line][one.column]
    this.gamePhase[one.line][one.column] = this.gamePhase[two.line][two.column]
    this.gamePhase[two.line][two.column] = temp;
  }

  private generateNewState() {
    const state = new State();
    state.gamePhase = _.cloneDeep(this.gamePhase);
    state.parent = this;
    
    return state;
  }

  heuristic() {
    let estimate = 0;

    const gamePhaseGoal = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ]

    for (let i = 0; i < gamePhaseGoal.length; i++) {
      for (let j = 0; j < gamePhaseGoal[i].length; j++) {
        if (gamePhaseGoal[i][j] != this.gamePhase[i][j]) {
          estimate += 1;
        }
      }
    }

    return estimate;
  }

  f() {
    return this.g + this.heuristic();
  }

  isGoal() {
    const gamePhaseGoal = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ]

    for (let i = 0; i < gamePhaseGoal.length; i++) {
      for (let j = 0; j < gamePhaseGoal[i].length; j++) {
        if (this.gamePhase[i][j] != gamePhaseGoal[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  private moveTop() {
    if (this.blankPosition.line > 0) {
      const state = this.generateNewState();
      state.blankPosition = { line: this.blankPosition.line - 1, column: this.blankPosition.column }
      state.swap(this.blankPosition, state.blankPosition);
      return state;
    }
  }

  private moveBottom() {
    if (this.blankPosition.line < (this.gamePhase.length - 1)) {
      const state = this.generateNewState();
      state.blankPosition = { line: this.blankPosition.line + 1, column: this.blankPosition.column }
      state.swap(this.blankPosition, state.blankPosition);
      return state;
    }
  }

  private moveLeft() {
    if (this.blankPosition.column > 0) {
      const state = this.generateNewState();
      state.blankPosition = { line: this.blankPosition.line, column: this.blankPosition.column - 1};
      state.swap(this.blankPosition, state.blankPosition);
      return state;
    }
  }

  private moveRight() {
    if (this.blankPosition.column < (this.gamePhase[this.blankPosition.line].length - 1)) {
      const state = this.generateNewState();
      state.blankPosition = { line: this.blankPosition.line, column: this.blankPosition.column + 1 };
      state.swap(this.blankPosition, state.blankPosition);
      return state;
    }
  }

  neighbors(): State[] {
    const neighbors = [];
    
    const moveTop = this.moveTop();
    if (moveTop) neighbors.push(moveTop);

    const moveBottom = this.moveBottom();
    if (moveBottom) neighbors.push(moveBottom);

    const moveLeft = this.moveLeft();
    if (moveLeft) neighbors.push(moveLeft);

    const moveRight = this.moveRight();
    if (moveRight) neighbors.push(moveRight);

    return neighbors;
  }
}

function compare(nodeOne: State, nodeTwo: State) {
  return nodeOne.f() > nodeTwo.f();
}

function reconstructPath(state: State) {
  let current = state;
  while (current.parent) {
    console.log(current.gamePhase);
    current = current.parent;
  }
}

function aStar() {
  const startState = new State();
  startState.gamePhase = [
    [6,3,4],
    [8,0,7],
    [1,5,2]
  ]
  startState.blankPosition = {line: 1, column: 1}

  const edge = new Heap<State>(compare);
  edge.add(startState);
  let trys = 0;

  while (edge.length() > 0) {
    const current = edge.remove();
    trys += 1;
    console.log(current.gamePhase);

    if (current.isGoal()) {
      return reconstructPath(current);
    }

    for (const neighbor of current.neighbors()) {
      neighbor.g = current.g + 1;
      edge.add(neighbor);
    }
  }
}

function main() {
  aStar();
}

main();