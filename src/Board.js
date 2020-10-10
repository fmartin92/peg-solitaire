import React from "react";
import "./Board.css";
import {
  INVALID_SQUARE,
  EMPTY_SQUARE,
  PEG_SQUARE,
  BOARD_SIDE_LENGTH,
} from "./game/Game";

const DEFAULT_STATE = {
  candidateTargets: [],
  moveSrcRow: -1,
  moveSrcCol: -1,
};

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
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

          if (this.isCandidateTarget(row, col))
            cssClassNames.push("candidate-target");

          if (row === this.state.moveSrcRow && col === this.state.moveSrcCol)
            cssClassNames.push("selected");

          if (this.isPegDraggable(row, col)) cssClassNames.push("draggable");

          return (
            <div
              key={`${row},${col}`}
              className={`cell ${cssClassNames.join(" ")}`}
              draggable={this.isPegDraggable(row, col)}
              onMouseEnter={() => this.onMouseEnter(row, col)}
              onMouseLeave={() => this.onMouseLeave()}
              onDragStart={() => this.onPegDragStart(row, col)}
              onDragEnd={() => this.onPegDragEnd()}
              // event dragover will inhibit drop if the default behavior is not prevented
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => this.onSquareDrop(row, col)}
            >
              <div className="peg"></div>
            </div>
          );
        })}
      </div>
    );
  }

  onMouseEnter(row, col) {
    this.setState({
      candidateTargets: this.props.game.getValidMovesAt(row, col),
    });
  }

  onMouseLeave(event) {
    this.setState(DEFAULT_STATE);
  }

  onPegDragStart(row, col) {
    if (!this.isPegDraggable(row, col)) return;
    this.setState({
      candidateTargets: this.props.game.getValidMovesAt(row, col),
      moveSrcRow: row,
      moveSrcCol: col,
    });
  }

  onPegDragEnd() {
    this.dragDidStop();
  }

  onSquareDrop(row, col) {
    if (this.isMoving() && this.isCandidateTarget(row, col)) {
      const newGame = this.props.game.moveTo(
        this.state.moveSrcRow,
        this.state.moveSrcCol,
        row,
        col
      );
      this.props.gameChangedCb(newGame);
    }
    this.dragDidStop();
  }

  dragDidStop() {
    this.setState(DEFAULT_STATE);
  }

  isPegDraggable(row, col) {
    return this.props.game.getValidMovesAt(row, col).length > 0;
  }

  isMoving() {
    return this.state.moveSrcRow >= 0 && this.state.moveSrcCol >= 0;
  }

  isCandidateTarget(row, col) {
    return !!this.state.candidateTargets.find(
      (move) => move[0] === row && move[1] === col
    );
  }
}
