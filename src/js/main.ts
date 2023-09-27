import { Heap } from "./heap.js";
import { disabledActions, drawMatrix, drawStats, enabledActions  } from "./client.js";

var _: any;

const gamePhaseGoal = [
  [0,1,2],
  [3,4,5],
  [6,7,8]
]

drawMatrix(gamePhaseGoal);

export enum EHeuristic {
  NUMBEROFPARTSOUTOFPLACE = 'Number of Parts Out of Place',
  MANHATTAN = 'Manhattan'
}

export interface MatrixPosition {
  line: number;
  column: number;
}

export function numberOfPartsOutOfPlace(gamePhase: number[][]) {
  let estimate = 0;

  for (let i = 0; i < gamePhaseGoal.length; i++) {
    for (let j = 0; j < gamePhaseGoal[i].length; j++) {
      if (gamePhaseGoal[i][j] != gamePhase[i][j]) {
        estimate += 1;
      }
    }
  }

  return estimate;
}

export function manhattan(gamePhase: number[][]) {
  let goalPositions: any = {
    0: [0,0],
    1: [0,1],
    2: [0,2],
    3: [1,0],
    4: [1,1],
    5: [1,2],
    6: [2,0],
    7: [2,1],
    8: [2,2]
  };
  let estimate = 0;

  for (let i = 0; i < gamePhase.length; i++) {
    for (let j = 0; j < gamePhase[i].length; j++) {
      const goalPosition = goalPositions[gamePhase[i][j]]
      estimate += Math.abs(i - goalPosition[0]) + Math.abs(j - goalPosition[1])
    }
  }

  return estimate;
}

export class State {
  gamePhase: number[][] = [];
  g: number = 0;
  parent: State | null = null;
  blankPosition: MatrixPosition = { line: 0, column: 0 };
  heuristicType: EHeuristic = EHeuristic.NUMBEROFPARTSOUTOFPLACE;

  private swap(one: MatrixPosition, two: MatrixPosition) {
    const temp = this.gamePhase[one.line][one.column]
    this.gamePhase[one.line][one.column] = this.gamePhase[two.line][two.column]
    this.gamePhase[two.line][two.column] = temp;
  }

  private generateNewState() {
    const state = new State();
    state.gamePhase = _.cloneDeep(this.gamePhase);
    state.parent = this;
    state.heuristicType = this.heuristicType;
    
    return state;
  }

  heuristic() {
    if (this.heuristicType == EHeuristic.MANHATTAN) {
      return manhattan(this.gamePhase)
    } else {
      return numberOfPartsOutOfPlace(this.gamePhase)
    }
  }

  f() {
    return this.g + this.heuristic();
  }

  isGoal() {
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

export async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time)
  })
}

export function compare(nodeOne: State, nodeTwo: State) {
  return nodeOne.f() > nodeTwo.f();
}

export async function reconstructPath(state: State) {
  let states: State[] = [];
  let current = _.cloneDeep(state);
  while (current.parent) {
    states.push(current);
    current = _.cloneDeep(current.parent);
  }
  states = states.reverse();
  for (let i = 0; i < states.length; i++) {
    await sleep(200)
    drawStats(states[i].g, states[i].heuristic(), states[i].f())
    drawMatrix(states[i].gamePhase);
  }
  enabledActions();
}

export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleState(state: State): State {
  const neighbors = state.neighbors();
  return neighbors[randomNumber(0, neighbors.length - 1)];
}

export function withoutSolution() {
  alert('Nao encontrei a solucao!');
  enabledActions();
}

export function aStar(startState: State, heuristicType: EHeuristic) {
  disabledActions();
  const edge = new Heap<State>(compare);
  const visited: any = {};
  startState.heuristicType = heuristicType;
  edge.add(startState);
  let trys = 0;

  while (edge.length() > 0) {
    const current = edge.remove();
    visited[current.gamePhase.toString()] = true;
    trys += 1;

    if (current.isGoal()) {
      return reconstructPath(current);
    }

    for (const neighbor of current.neighbors()) {
      if (!visited[neighbor.gamePhase.toString()]) {
        neighbor.g = current.g + 1;
        edge.add(neighbor);
      }
    }
  }

  return null;
}

export function getStateByGamePhaseAndBlankPosition(gamePhase: number[][], blankPosition: {line: number, column: number}) {
  const state = new State();
  state.gamePhase = gamePhase;
  state.blankPosition = blankPosition;
  return state;
}

export function getRandomState() {
  let startState = new State();
  startState.gamePhase = _.cloneDeep(gamePhaseGoal);
  startState.blankPosition = {line: 0, column: 0}

  for (let i = 0; i < randomNumber(40, 200); i++) {
    startState = shuffleState(startState);
    startState.parent = null;
  }

  drawMatrix(startState.gamePhase);

  return startState;
}

export function main(lodash: any) {
  _ = lodash;
  //testBatteries();
}

function testBatteries() {
  const tests: any = {}

  for (let i = 0; i < 200; i++) {
    const state = getRandomState();
    if (!tests[state.gamePhase.toString()]) {
      tests[state.gamePhase.toString()] = {
        NUMBEROFPARTSOUTOFPLACE: aStar(state, EHeuristic.NUMBEROFPARTSOUTOFPLACE),
        MANHATTAN: aStar(state, EHeuristic.MANHATTAN)
      }
    }
  }

  console.log(tests);
}