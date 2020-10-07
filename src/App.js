import React from "react";
import "./App.css";
import { ALGORITHMS, DEFAULT_ALGORITHM } from "./game/Heuristics";
import { Board } from "./Board";
import { DebugTools } from "./DebugTools";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { DecisionTree } from "./game/DecisionTree";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: DEFAULT_ALGORITHM,
      decisionTree: new DecisionTree(),
    };
  }

  /*get decisionNode() {
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
  }*/

  newMovement() {
    this.state.decisionTree.move(
      ALGORITHMS.get(this.state.algorithm)(this.state.decisionTree.currentNode)
    );
  }

  render() {
    return (
      <div className="app">
        <div className="board-and-controls">
          <Board
            game={this.state.decisionTree.game}
            gameChangedCb={(newGame) => {
              this.onGameChange(newGame);
              this.forceUpdate();
            }}
          />
          <div className="controls">
            <button
              onClick={() => {
                this.newMovement();
                this.forceUpdate();
              }}
              disabled={this.state.decisionTree.game.isOver()}
            >
              New movement
            </button>
            <AlgorithmSelector
              value={this.state.algorithm}
              onAlgorithmChange={(algorithm) =>
                this.onAlgorithmChange(algorithm)
              }
            />
            <button
              onClick={() => {
                this.state.decisionTree.undo();
                this.forceUpdate();
              }}
              disabled={!this.state.decisionTree.canUndo()}
            >
              Undo
            </button>
            <button
              onClick={() => {
                this.state.decisionTree.redo();
                this.forceUpdate();
              }}
              disabled={!this.state.decisionTree.canRedo()}
            >
              Redo
            </button>
            <button
              onClick={() => {
                this.state.decisionTree.restart();
                this.forceUpdate();
              }}
            >
              Restart
            </button>
          </div>
        </div>
        <DebugTools />
      </div>
    );
  }

  onGameChange(newGame) {
    this.state.decisionTree.move(newGame);
  }

  onAlgorithmChange(algorithm) {
    this.setState({ algorithm: algorithm });
  }
}

export default App;
