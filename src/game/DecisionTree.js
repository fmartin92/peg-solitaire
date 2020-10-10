import { DecisionNode } from "./DecisionNode";
import { Game } from "./Game";

export class DecisionTree {
  constructor() {
    this.restart();
  }

  restart() {
    this._rootNode = new DecisionNode(new Game());
    this._currentNode = this._rootNode;
    this._mostRecentNode = this._rootNode;
  }

  get currentNode() {
    return this._currentNode;
  }

  get game() {
    return this._currentNode.game;
  }

  move(gameOrNode) {
    let newNode;
    if (gameOrNode instanceof Game) {
      newNode = this._currentNode.findChildByGame(gameOrNode);
      if (!newNode) throw new Error("Tried to move to an unreachable position");
    } else if (gameOrNode instanceof DecisionNode) {
      newNode = gameOrNode;
      if (!this.currentNode.children.includes(newNode)) {
        throw new Error("Tried to move to an unreachable position");
      }
    } else {
      throw new Error("move() accepts Game or DecisionNode objects only.");
    }
    this._currentNode = newNode;
    this._mostRecentNode = newNode;
  }

  canUndo() {
    return this._currentNode !== this._rootNode;
  }

  canRedo() {
    return this._currentNode !== this._mostRecentNode;
  }

  undo() {
    if (!this.canUndo()) {
      throw new Error("Already at earliest move");
    }
    this._currentNode = this._currentNode.parent;
  }

  redo() {
    if (!this.canRedo()) {
      throw new Error("Already at most recent move");
    }
    let node = this._mostRecentNode;
    while (node.parent !== this._currentNode) {
      node = node.parent;
    }
    this._currentNode = node;
  }
}
