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
    this.state = {
      gameTree: new DecisionNode(new Game(), 1),
      algorithm: DEFAULT_ALGORITHM,
    };
  }

  newMovement() {
    const newGameTree = ALGORITHMS.get(this.state.algorithm)(
      this.state.gameTree
    );
    this.setState({ gameTree: newGameTree });
  }

  restart() {
    this.setState({ gameTree: new DecisionNode(new Game(), 1) });
  }

  render() {
    return (
      <div className="app">
        <div className="board-and-controls">
          <Board
            game={this.state.gameTree.game}
            gameChangedCb={(newGame) => this.onGameChange(newGame)}
          />
          <div className="controls">
            <button
              onClick={() => this.newMovement()}
              disabled={this.state.gameTree.game.isOver()}
            >
              Nuevo movimiento
            </button>
            <AlgorithmSelector
              value={this.state.algorithm}
              onAlgorithmChange={algorithm => this.onAlgorithmChange(algorithm)}/>
            <button onClick={() => this.restart()}>Reiniciar</button>
          </div>
        </div>
        <DebugTools />
      </div>
    );
  }

  onGameChange(newGame) {
    this.setState({ gameTree: new DecisionNode(newGame, 1) });
  }

  onAlgorithmChange(algorithm) {
    this.setState({ algorithm: algorithm });
  }
}

export default App;
