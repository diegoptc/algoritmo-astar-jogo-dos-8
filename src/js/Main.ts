import { Heap } from "./Heap";

export class State {
  g: number = 0;
  h: number = 0;

  f() {
    return this.g + this.h;
  }
}

function compare(parentNode: State, node: State) {
  return parentNode.f() > node.f();
}

function gerarNumeroAleatorio(min: number, max: number) {
  // Gera um número aleatório entre 0 (inclusive) e 1 (exclusivo)
  const random = Math.random();
  
  // Calcula um número dentro do intervalo [min, max]
  const numeroAleatorio = Math.floor(random * (max - min + 1)) + min;
  
  return numeroAleatorio;
}

function aStar() {
  const edge = new Heap<State>(compare);

  for (let i = 0; i < 10; i++) {
    const state = new State();
    state.g = gerarNumeroAleatorio(1, 20);
    state.h = gerarNumeroAleatorio(1, 20);
    edge.add(state);
  }

  console.log(edge.heap);
}

function main() {
  aStar();
}

main();