import React from "react";
import "./Board.css";
import { UP, RIGHT, DOWN, LEFT, INVALID_SQUARE, EMPTY_SQUARE, PEG_SQUARE } from "./game/Game";

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidateMoves: [],
      moving: false,
      moveSrcX: -1,
      moveSrcY: -1,
    };
  }

  render() {
    const coords = [];
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        coords.push([x, y]);
      }
    }

    return (
      <div className="board">
        {coords.map((coord) => {
          const [x, y] = coord;

          const cssClassNames = [];

          switch (this.props.game.get(x, y)) {
            case INVALID_SQUARE:
              cssClassNames.push('invalid-square');
              break;
              case EMPTY_SQUARE:
                cssClassNames.push('empty-square');
                break;
              case PEG_SQUARE:
                cssClassNames.push('peg-square');
              break;
            default:
              throw new Error(
                `invalid square at ${x}, ${y}: "${this.props.game.get(x, y)}"`
              );
          }

          if (this.isCandidateMove(x, y)) cssClassNames.push('candidate-move');

          if(x === this.state.moveSrcX && y === this.state.moveSrcY) cssClassNames.push('selected');

          return (
            <div key={`${x},${y}`}
                 className={`cell ${cssClassNames.join(' ')}`}
                 onClick={(event) => this.onCellClick(x, y)}>
            </div>
          );
        })}
      </div>
    );
  }

  onCellClick(x, y) {
    if (this.state.moving) {
      this.finishMove(x, y)
    } else {
      if (this.props.game.get(x, y) !== PEG_SQUARE) return;
      this.startMove(x, y)
    }
  }
  
  startMove(x, y) {
    const candidateMoves = this.props.game.getValidMovesAt(x, y);
    if (candidateMoves.length > 0) {
      this.setState({
        candidateMoves: candidateMoves,
        moving: true,
        moveSrcX: x,
        moveSrcY: y,
      });
    }
  }
  
  finishMove(x, y) {
    if (this.isCandidateMove(x, y)) {
      let direction;
      if (y < this.state.moveSrcY) {
        direction = UP;
      }
      if (x > this.state.moveSrcX) {
        direction = RIGHT;
      }
      if (y > this.state.moveSrcY) {
        direction = DOWN;
      }      
      if (x < this.state.moveSrcX) {
        direction = LEFT;
      }

      const newGame = this.props.game.move(this.state.moveSrcX, this.state.moveSrcY, direction);
      this.props.gameChangedCb(newGame);
    }
    this.setState({
      candidateMoves: [],
      moving: false,
      moveSrcX: -1,
      moveSrcY: -1,
    });
  }

  isCandidateMove(x, y) {
    return !!this.state.candidateMoves.find(move => move[0] === x && move[1] === y);
  }
}
