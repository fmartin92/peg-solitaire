import React from "react";
import "./Board.css";
import { Game, INVALID_SQUARE, EMPTY_SQUARE, PEG_SQUARE } from "./game/Game";

export class Board extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const coords = [];
    for(let y = 0; y < 7; y++) {
      for(let x = 0; x < 7; x++) {
        coords.push([x, y]);
      }
    }

    const game = new Game();

    return (
      <div className="board">
        {coords.map(coord => {
          const [x, y] = coord;

          let cellCssClass;
          switch (game.get(x, y)) {
            case INVALID_SQUARE:
              cellCssClass = "invalid-square";
              break;
            case EMPTY_SQUARE:
              cellCssClass = "empty-square";
              break;
            case PEG_SQUARE:
              cellCssClass = "peg-square";
              break;
            default:
              throw new Error(`invalid square at ${x}, ${y}: "${game.get(x, y)}"`);
          }

          return (
            <div className={"cell " + cellCssClass}></div>
          );
        })}
      </div>
      );
  }

}
