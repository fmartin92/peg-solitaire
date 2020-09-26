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
import { Board } from './Board';

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
      <p>Aca va el componente</p>
      <Board/>
      <p>Listo el poyo</p>
    </div>
  );
}

export default App;
