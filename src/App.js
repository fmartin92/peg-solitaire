import React from "react";
import "./App.css";
import { Game } from "./game/Game";
import { ALGORITHMS, DEFAULT_ALGORITHM } from "./game/Heuristics";
import { DecisionNode } from "./game/DecisionNode";
import { Board } from "./Board";
import { DebugTools } from "./DebugTools";
import { AlgorithmSelector } from "./AlgorithmSelector";

class App extends React.Component {
  constructor(props) {
    super(props);
    const initialGame = new DecisionNode(new Game(), 1);
    this.state = {
      algorithm: DEFAULT_ALGORITHM,
      gameHistory: [initialGame],
      currentGameIdx: 0,
    };
  }

  canUndo() {
    return this.state.currentGameIdx > 0;
  }

  canRedo() {
    return this.state.currentGameIdx < this.state.gameHistory.length - 1;
  }

  undo() {
    if (!this.canUndo) {
      throw new Error("Could not undo movement");
    }
    this.setState({ currentGameIdx: this.state.currentGameIdx - 1 });
  }

  redo() {
    if (!this.canRedo()) {
      throw new Error("Could not redo movement");
    }
    this.setState({ currentGameIdx: this.state.currentGameIdx + 1 });
  }

  restart() {
    const initialGame = new DecisionNode(new Game(), 1);
    this.setState({ currentGameIdx: 0, gameHistory: [initialGame] });
  }

  get decisionNode() {
    return this.state.gameHistory[this.state.currentGameIdx];
  }

  set decisionNode(newNode) {
    const newGameHistory = this.state.gameHistory.slice(
      0,
      this.state.currentGameIdx + 1
    );
    newGameHistory.push(newNode);
    this.setState({
      gameHistory: newGameHistory,
      currentGameIdx: this.state.currentGameIdx + 1,
    });
  }

  newMovement() {
    const newGameTree = ALGORITHMS.get(this.state.algorithm)(this.decisionNode);
    this.decisionNode = newGameTree;
  }

  render() {
    return (
      <div className="app">
        <div className="board-and-controls">
          <Board
            game={this.decisionNode.game}
            gameChangedCb={(newGame) => this.onGameChange(newGame)}
          />
          <div className="controls">
            <button
              onClick={() => this.newMovement()}
              disabled={this.decisionNode.game.isOver()}
            >
              New movement
            </button>
            <AlgorithmSelector
              value={this.state.algorithm}
              onAlgorithmChange={(algorithm) =>
                this.onAlgorithmChange(algorithm)
              }
            />
            <button onClick={() => this.undo()} disabled={!this.canUndo()}>
              Undo
            </button>
            <button onClick={() => this.redo()} disabled={!this.canRedo()}>
              Redo
            </button>
            <button onClick={() => this.restart()}>Restart</button>
          </div>
        </div>
        <DebugTools />
      </div>
    );
  }

  onGameChange(newGame) {
    this.decisionNode = new DecisionNode(newGame, 1);
  }

  onAlgorithmChange(algorithm) {
    this.setState({ algorithm: algorithm });
  }
}

export default App;
