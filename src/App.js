import React from "react";
import logo from "./logo.svg";
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
