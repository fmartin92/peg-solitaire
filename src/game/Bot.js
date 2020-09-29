import { Game } from "./Game";
import { DecisionNode } from "./DecisionNode";

export class Bot {
  constructor(heuristic, params = {}) {
    this._heuristic = heuristic;
    this._params = params;
  }

  run() {
    let game = new Game();
    let decisionNode = new DecisionNode(game);
    while (!decisionNode.game.isOver()) {
      decisionNode = this._heuristic(decisionNode, this._params);
    }
    return decisionNode.game;
  }

  get scores() {
    return this._scores || [];
  }

  get times() {
    return this._times || [];
  }

  runMany(n) {
    this._scores = [];
    this._times = [];
    for (let i = 0; i < n; i++) {
      const t0 = performance.now();
      const game = this.run();
      const t1 = performance.now();

      this._scores.push(game.numPegsLeft());
      this._times.push(t1 - t0);
    }
  }
}
