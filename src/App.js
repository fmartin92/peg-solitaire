import React from "react";
import "./App.css";
import { Game } from "./game/Game";
import { Bot } from "./game/Bot";
import {
  maximizeDescendents,
  randomChoice,
  randomizedMaximizeDescendents,
  randomizedMaximizeDescendentsFewConnectedComponents,
} from "./game/Heuristics";
import { DecisionNode } from "./game/DecisionNode";
import { Board } from "./Board";

//hackity hack to be able to debug using the console
window.Game = Game;
window.Bot = Bot;
window.randomChoice = randomChoice;
window.DecisionNode = DecisionNode;
window.maximizeDescendents = maximizeDescendents;
window.randomizedMaximizeDescendents = randomizedMaximizeDescendents;
window.randomizedMaximizeDescendentsFewConnectedComponents = randomizedMaximizeDescendentsFewConnectedComponents;
window.game = new Game();
window.tree = new DecisionNode(window.game, 2);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gameTree: new DecisionNode(new Game(), 1), isOver: false };
  }

  newMovement() {
    const newGameTree = randomChoice(this.state.gameTree);
    this.setState({ gameTree: newGameTree, isOver: newGameTree.game.isOver() });
  }

  restart() {
    this.setState({ gameTree: new DecisionNode(new Game(), 1), isOver: false });
  }
  render() {
    return (
      <div className="App">
        <Board game={this.state.gameTree.game} />
        <button
          onClick={() => {
            this.newMovement();
          }}
          disabled={this.state.isOver}
        >
          Nuevo movimiento
        </button>
        <button
          onClick={() => {
            this.restart();
          }}
          disabled={!this.state.isOver}
        >
          Reiniciar
        </button>
      </div>
    );
  }
}

export default App;
