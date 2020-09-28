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
// window.Game = Game;
// window.Bot = Bot;
// window.randomChoice = randomChoice;
// window.DecisionNode = DecisionNode;
// window.maximizeDescendents = maximizeDescendents;
// window.randomizedMaximizeDescendents = randomizedMaximizeDescendents;
// window.randomizedMaximizeDescendentsFewConnectedComponents = randomizedMaximizeDescendentsFewConnectedComponents;
// window.game = new Game();
// window.tree = new DecisionNode(window.game, 2);

const ALGORITHMS = new Map();
ALGORITHMS.set('Maximize descendents',  maximizeDescendents);
ALGORITHMS.set('Random choice', randomChoice);
const DEFAULT_ALGORITHM = 'Maximize descendents';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTree: new DecisionNode(new Game(), 1),
      algorithm: DEFAULT_ALGORITHM,
    };
  }

  newMovement() {
    // const newGameTree = randomChoice(this.state.gameTree);
    const newGameTree = ALGORITHMS.get(this.state.algorithm)(this.state.gameTree);
    this.setState({ gameTree: newGameTree });
  }

  restart() {
    this.setState({ gameTree: new DecisionNode(new Game(), 1) });
  }

  render() {
    return (
      <div className="App">
        <Board game={this.state.gameTree.game}
               gameChangedCb={(newGame) => this.onGameChange(newGame)} />
        <button onClick={() => this.newMovement()} disabled={this.state.gameTree.game.isOver()}>
          Nuevo movimiento
        </button>
        <button onClick={() => this.restart()}>
          Reiniciar
        </button>
        <select value={this.state.algorithm}
                onChange={(event) => this.onAlgorithmChange(event)}>
          {Array.from(ALGORITHMS).map(entry =>
              <option key={entry[0]}
                      value={entry[0]}>
                {entry[0]}
              </option>
          )}
        </select>
      </div>
    );
  }

/*
  maximizeDescendents,
  randomChoice,
  randomizedMaximizeDescendents,
  randomizedMaximizeDescendentsFewConnectedComponents,
*/

  onGameChange(newGame) {
    this.setState({gameTree: new DecisionNode(newGame, 1)});
  }

  onAlgorithmChange(event) {
    this.setState({algorithm: event.target.value});
  }
}

export default App;
