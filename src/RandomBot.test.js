import { RandomBot } from "./RandomBot";

describe("RandomBot", () => {
  test("run", () => {
    const bot = new RandomBot();
    bot.run(/* print= */ false);
  });

  test("run many", () => {
    const bot = new RandomBot();
    bot.runMany(10);
  });
});
