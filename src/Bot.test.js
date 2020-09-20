import { Bot } from './Bot';

describe('Bot', () => {
  test('run', () => {
    const bot = new Bot();
    bot.run(/* print= */ true);
  });

  test('run many', () => {
    const bot = new Bot();
    bot.runMany(100);
  });
});