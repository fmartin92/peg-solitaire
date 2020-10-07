export class DecisionNode {
  constructor(game, parent = null) {
    this._game = game;
    this._parent = parent;
    this._children = null;
  }

  get parent() {
    return this._parent;
  }

  clearParent() {
    this._parent = null;
  }

  get game() {
    return this._game;
  }

  get children() {
    if (this._children === null) {
      this._children = this.game
        .getPossibleMoves()
        .map((game) => new DecisionNode(game, this));
    }
    return this._children;
  }

  getSubtreeSize(maxHeight) {
    if (maxHeight < 1)
      throw new Error(
        `maxHeight should be at least 1, got ${maxHeight} instead`
      );
    if (maxHeight === 1) return 1;
    return this.children
      .map((node) => node.getSubtreeSize(maxHeight - 1))
      .reduce((x, y) => x + y, 1);
  }

  findChildByGame(game) {
    return this.children.find((child) => child.game.equals(game));
  }
}
