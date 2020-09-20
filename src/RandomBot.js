import { Game } from "./Game";

export class RandomBot {
  constructor() {}

  run(print = false) {
    let game = new Game();

    const printGame = (game) => {
      if (!print) return;
      console.log(`PEGS LEFT: ${game.numPegsLeft()}`);
      console.log(game.toString());
    };

    while (!game.isOver()) {
      printGame(game);
      const moves = game.getPossibleMoves();
      game = moves[Math.floor(Math.random() * moves.length)];
    }

    printGame(game);

    return game;
  }

  runMany(n) {
    const results = [];
    const scoreCount = new Map();
    for (let i = 0; i < n; i++) {
      const game = this.run();
      results.push(game);

      // if (game.numPegsLeft() > 10) {
      //   console.log(`PEGS LEFT: ${game.numPegsLeft()}`);
      //   console.log(game.toString());
      // }

      if (!scoreCount.has(game.numPegsLeft())) {
        scoreCount.set(game.numPegsLeft(), 0);
      }

      scoreCount.set(
        game.numPegsLeft(),
        scoreCount.get(game.numPegsLeft()) + 1
      );
    }

    // console.log(results.map(game => game.numPegsLeft()));

    const entries = [...scoreCount.entries()];
    entries.sort((a, b) => a[0] - b[0]);
    //entries.forEach(entry => console.log(`${entry[0]}: ${entry[1]}`));
  }
}
