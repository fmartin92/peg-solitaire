export class DecisionNode {
  constructor(game, height = 1) {
    this.game = game;
    if (height > 1) {
      this.children = this._getChildren(height - 1);
    } else {
      this.children = undefined;
    }
    this.height = height;
  }

  _getChildren(height) {
    return this.game
      .getPossibleMoves()
      .map((game) => new DecisionNode(game, height));
  }

  getSubtreeSize() {
    if (this.children) {
      return (
        1 +
        this.children
          .map((node) => node.getSubtreeSize())
          .reduce((x, y) => x + y, 0)
      );
    } else {
      return 1;
    }
  }

  extendTree(newHeight) {
    if (newHeight > this.height) {
      if (this.height === 1) {
        this.children = this._getChildren(newHeight);
      } else {
        this.children.forEach((node) => node.extendTree(newHeight - 1));
      }
    }
    this.height = newHeight;
  }
}
