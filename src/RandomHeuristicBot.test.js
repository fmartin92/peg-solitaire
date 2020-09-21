import { Game } from "./Game";
import { RandomHeuristicBot } from "./RandomHeuristicBot";

describe("RandomHeuristicBot", () => {
  test("run", () => {
    const bot = new RandomHeuristicBot();
    bot.run(/* print= */ false);
  });

  test("run many", () => {
    const bot = new RandomHeuristicBot();
    bot.runMany(5);
  });
});
