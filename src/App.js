import React from "react";
import "./App.css";
import { DEFAULT_ALGORITHM } from "./game/Algorithms";
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

  newMovement() {
    const defaultParams = {};
    Object.entries(this.state.algorithm.params).forEach(
      ([key, value]) => (defaultParams[key] = value.default)
    );
    this.state.decisionTree.move(
      this.state.algorithm.play(this.state.decisionTree.currentNode, {
        height: 2,
        pow: 30,
      })
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
              value={this.state.algorithm.name}
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
