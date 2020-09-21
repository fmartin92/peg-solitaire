import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Game } from "./Game";
import { Bot } from "./Bot";
import {
  maximizeDescendents,
  randomChoice,
  randomizedMaximizeDescendents,
} from "./Heuristics";
import { DecisionNode } from "./DecisionNode";

//hackity hack to be able to debug using the console
window.Game = Game;
window.Bot = Bot;
window.randomChoice = randomChoice;
window.DecisionNode = DecisionNode;
window.maximizeDescendents = maximizeDescendents;
window.randomizedMaximizeDescendents = randomizedMaximizeDescendents;
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
