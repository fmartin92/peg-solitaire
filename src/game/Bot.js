import { Game } from "./Game";
import { DecisionNode } from "./DecisionNode";
import { makeDefaultAlgorithmParams } from "./Algorithms";

export class Bot {
  constructor(algorithm, params) {
    this._algorithm = algorithm;
    this._params = params || makeDefaultAlgorithmParams(algorithm);
  }

  run() {
    const game = new Game();
    let decisionNode = new DecisionNode(game);
    while (!decisionNode.game.isOver()) {
      decisionNode = this._algorithm.play(decisionNode, this._params);
      decisionNode.clearParent();
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
