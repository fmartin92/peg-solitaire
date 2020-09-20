import { Game } from "./Game";
import { HeuristicBot, DecisionNode } from "./HeuristicBot";

describe("DecisionNode", () => {
  test("subtree size is 1 when height is 1", () => {
    const game = new Game();
    const tree = new DecisionNode(game, /* height= */ 1);
    expect(tree.getSubtreeSize()).toEqual(1);
  });

  test("subtree size is 5 when height is 2", () => {
    const game = new Game();
    const tree = new DecisionNode(game, /* height= */ 2);
    expect(tree.getSubtreeSize()).toEqual(5);
  });

  test("subtree size is 17 when height is 3", () => {
    const game = new Game();
    const tree = new DecisionNode(game, /* height= */ 3);
    expect(tree.getSubtreeSize()).toEqual(17);
  });
});

describe("HeuristicBot", () => {
  test("run", () => {
    const bot = new HeuristicBot();
    bot.run(/* print= */ false);
  });

  test("run many", () => {
    const bot = new HeuristicBot();
    bot.runMany(7);
  });
});
