import { Game } from "./Game";
import { DecisionNode } from "./DecisionNode";

export class Bot {
  constructor(heuristic, params = {}) {
    this._heuristic = heuristic;
    this._params = params;
  }

  run(print = false) {
    let game = new Game();
    let gameTree = new DecisionNode(game);

    const printGame = (game) => {
      if (!print) return;
      console.log(`PEGS LEFT: ${game.numPegsLeft()}`);
      console.log(game.toString());
    };

    while (!gameTree.game.isOver()) {
      printGame(gameTree.game);
      gameTree = this._heuristic(gameTree, this._params);
    }
    printGame(gameTree.game);

    return gameTree.game;
  }

  runMany(n) {
    const results = [];
    const scoreCount = new Map();
    for (let i = 0; i < n; i++) {
      const game = this.run();
      results.push(game);

      if (!scoreCount.has(game.numPegsLeft())) {
        scoreCount.set(game.numPegsLeft(), 0);
      }

      scoreCount.set(
        game.numPegsLeft(),
        scoreCount.get(game.numPegsLeft()) + 1
      );
    }

    const entries = [...scoreCount.entries()];
    entries.sort((a, b) => a[0] - b[0]);
    return entries;
  }
}
