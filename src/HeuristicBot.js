import { Game } from "./Game";

export class HeuristicBot {
  run(print = false) {
    let game = new Game();

    const printGame = (game) => {
      if (!print) return;
      console.log(`PEGS LEFT: ${game.numPegsLeft()}`);
      console.log(game.toString());
    };

    const height = 3;
    while (!game.isOver()) {
      printGame(game);
      const moves = game.getPossibleMoves();
      const scores = moves.map((move) => {
        const tree = new DecisionNode(move, height);
        return tree.getSubtreeSize();
      });
      const maxScore = Math.max(...scores);
      const candidates = moves.filter((_, idx) => scores[idx] === maxScore);
      //console.log(candidates.length, moves.length);
      game = candidates[Math.floor(Math.random() * candidates.length)];
    }

    console.log(`PEGS LEFT: ${game.numPegsLeft()}`);
    console.log(game.toString());

    printGame(game);

    return game;
  }

  runMany(n) {
    const results = [];
    const scoreCount = new Map();
    for (let i = 0; i < n; i++) {
      const game = this.run();
      results.push(game);

      if (game.numPegsLeft() > 10) {
        console.log(`PEGS LEFT: ${game.numPegsLeft()}`);
        console.log(game.toString());
      }

      if (!scoreCount.has(game.numPegsLeft())) {
        scoreCount.set(game.numPegsLeft(), 0);
      }

      scoreCount.set(
        game.numPegsLeft(),
        scoreCount.get(game.numPegsLeft()) + 1
      );
    }

    console.log(results.map((game) => game.numPegsLeft()));

    const entries = [...scoreCount.entries()];
    entries.sort((a, b) => a[0] - b[0]);
    entries.forEach((entry) => console.log(`${entry[0]}: ${entry[1]}`));
  }
}

export class DecisionNode {
  constructor(game, height = 1) {
    this._game = game;
    if (height > 1) {
      this._children = this._getChildren(height - 1);
    } else {
      this._children = undefined;
    }
  }

  _getChildren(height) {
    return this._game
      .getPossibleMoves()
      .map((game) => new DecisionNode(game, height));
  }

  getSubtreeSize() {
    if (this._children) {
      return (
        1 +
        this._children
          .map((node) => node.getSubtreeSize())
          .reduce((x, y) => x + y, 0)
      );
    } else {
      return 1;
    }
  }
}
