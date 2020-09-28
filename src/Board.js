import React from "react";
import "./Board.css";
import {
  INVALID_SQUARE,
  EMPTY_SQUARE,
  PEG_SQUARE,
  BOARD_SIDE_LENGTH,
} from "./game/Game";

const INITIAL_STATE = {
  candidateMoves: [],
  moving: false,
  moveSrcRow: -1,
  moveSrcCol: -1,
};

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  render() {
    const coords = [];
    for (let row = 0; row < BOARD_SIDE_LENGTH; row++) {
      for (let col = 0; col < BOARD_SIDE_LENGTH; col++) {
        coords.push([row, col]);
      }
    }

    return (
      <div className="board">
        {coords.map((coord) => {
          const [row, col] = coord;

          const cssClassNames = [];

          switch (this.props.game.get(row, col)) {
            case INVALID_SQUARE:
              cssClassNames.push("invalid-square");
              break;
            case EMPTY_SQUARE:
              cssClassNames.push("empty-square");
              break;
            case PEG_SQUARE:
              cssClassNames.push("peg-square");
              break;
            default:
              throw new Error(
                `invalid square at ${row}, ${col}: "${this.props.game.get(
                  row,
                  col
                )}"`
              );
          }

          if (this.isCandidateMove(row, col))
            cssClassNames.push("candidate-move");

          if (row === this.state.moveSrcRow && col === this.state.moveSrcCol)
            cssClassNames.push("selected");

          return (
            <div
              key={`${row},${col}`}
              className={`cell ${cssClassNames.join(" ")}`}
              onClick={(event) => this.onCellClick(row, col)}
            ></div>
          );
        })}
      </div>
    );
  }

  onCellClick(row, col) {
    if (this.state.moving) {
      this.finishMove(row, col);
    } else {
      if (this.props.game.get(row, col) !== PEG_SQUARE) return;
      this.startMove(row, col);
    }
  }

  startMove(row, col) {
    const candidateMoves = this.props.game.getValidMovesAt(row, col);
    if (candidateMoves.length > 0) {
      this.setState({
        candidateMoves: candidateMoves,
        moving: true,
        moveSrcRow: row,
        moveSrcCol: col,
      });
    }
  }

  finishMove(row, col) {
    if (this.isCandidateMove(row, col)) {
      const newGame = this.props.game.moveTo(
        this.state.moveSrcRow,
        this.state.moveSrcCol,
        row,
        col
      );
      this.props.gameChangedCb(newGame);
    }
    this.setState(INITIAL_STATE);
  }

  isCandidateMove(row, col) {
    return !!this.state.candidateMoves.find(
      (move) => move[0] === row && move[1] === col
    );
  }
}
