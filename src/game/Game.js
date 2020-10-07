export const UP = "up";
export const RIGHT = "right";
export const DOWN = "down";
export const LEFT = "left";

export const INVALID_SQUARE = " ";
export const EMPTY_SQUARE = ".";
export const PEG_SQUARE = "X";

export const BOARD_SIDE_LENGTH = 7;

const INITIAL_BOARD = [
  "  XXX  ",
  "  XXX  ",
  "XXXXXXX",
  "XXX.XXX",
  "XXXXXXX",
  "  XXX  ",
  "  XXX  ",
].map((line) => line.split(""));

const deepCopy = (object) => JSON.parse(JSON.stringify(object));

export class Game {
  constructor(board) {
    this._board = board ? board : deepCopy(INITIAL_BOARD);
  }

  _computeDstSquare(row, col, direction) {
    /*returns the square you get after you moved from the square at indicated
      row and col in the given direction*/
    let dstRow = row,
      dstCol = col;

    switch (direction) {
      case UP:
        dstRow--;
        break;
      case RIGHT:
        dstCol++;
        break;
      case DOWN:
        dstRow++;
        break;
      case LEFT:
        dstCol--;
        break;
      default:
        throw new Error(`${direction} is not a valid direction`);
    }

    return [dstRow, dstCol];
  }

  _computeIntermediateDstSquare(srcRow, srcCol, dstRow, dstCol) {
    /*returns the square in between a source square and a jump target square*/
    return [(srcRow + dstRow) / 2, (srcCol + dstCol) / 2];
  }

  _computeJumpDstSquare(row, col, direction) {
    /*returns the square you get after you moved *twice* from the square at indicated
      row and col in the given direction*/
    const [row1, col1] = this._computeDstSquare(row, col, direction);
    return this._computeDstSquare(row1, col1, direction);
  }

  moveTo(srcRow, srcCol, dstRow, dstCol) {
    /*validates the move and returns a new Game instance with that move played*/
    if (!this._isValidMove(srcRow, srcCol, dstRow, dstCol)) {
      throw new Error("Invalid move");
    }
    const newBoard = deepCopy(this._board);
    const set = (row, col, value) => (newBoard[row][col] = value);

    const [
      intermediateRow,
      intermediateCol,
    ] = this._computeIntermediateDstSquare(srcRow, srcCol, dstRow, dstCol);

    set(srcRow, srcCol, EMPTY_SQUARE);
    set(intermediateRow, intermediateCol, EMPTY_SQUARE);
    set(dstRow, dstCol, PEG_SQUARE);

    return new Game(newBoard);
  }

  _isValidMove(srcRow, srcCol, dstRow, dstCol) {
    const [
      intermediateRow,
      intermediateCol,
    ] = this._computeIntermediateDstSquare(srcRow, srcCol, dstRow, dstCol);

    if (!this._isWithinBounds(srcRow, srcCol)) return false;
    if (!this._isWithinBounds(dstRow, dstCol)) return false;

    if (this.get(srcRow, srcCol) !== PEG_SQUARE) return false;
    if (this.get(intermediateRow, intermediateCol) !== PEG_SQUARE) return false;
    if (this.get(dstRow, dstCol) !== EMPTY_SQUARE) return false;

    return true;
  }

  getValidMovesAt(row, col) {
    const moves = [];
    [UP, RIGHT, DOWN, LEFT].forEach((direction) => {
      const [dstRow, dstCol] = this._computeJumpDstSquare(row, col, direction);
      if (this._isValidMove(row, col, dstRow, dstCol)) {
        moves.push([dstRow, dstCol]);
      }
    });
    return moves;
  }

  getPossibleMoves() {
    let moves = [];

    for (let row = 0; row < BOARD_SIDE_LENGTH; row++) {
      for (let col = 0; col < BOARD_SIDE_LENGTH; col++) {
        moves = moves.concat(
          this.getValidMovesAt(row, col).map(([dstRow, dstCol]) =>
            this.moveTo(row, col, dstRow, dstCol)
          )
        );
      }
    }

    return moves;
  }

  isOver() {
    return this.getPossibleMoves().length === 0;
  }

  get(row, col) {
    return this._board[row][col];
  }

  _isWithinBounds(row, col) {
    return (
      row >= 0 && row < BOARD_SIDE_LENGTH && col >= 0 && col < BOARD_SIDE_LENGTH
    );
  }

  _isPeg(row, col) {
    return this._isWithinBounds(row, col) && this.get(row, col) === PEG_SQUARE;
  }

  _getNeighborPegs(row, col) {
    const neighborPegs = [];
    const addCoordIfNeighborPeg = (row, col) => {
      if (this._isPeg(row, col)) {
        neighborPegs.push([row, col]);
      }
    };
    addCoordIfNeighborPeg(row, col - 1);
    addCoordIfNeighborPeg(row + 1, col);
    addCoordIfNeighborPeg(row, col + 1);
    addCoordIfNeighborPeg(row - 1, col);
    return neighborPegs;
  }

  _bfs(row, col, visitedCoords) {
    const queue = [[row, col]];
    while (queue.length !== 0) {
      const [curRow, curCol] = queue.shift();
      const coordAsString = `${curRow},${curCol}`;
      if (!visitedCoords.has(coordAsString)) {
        visitedCoords.add(coordAsString);
        this._getNeighborPegs(curRow, curCol)
          .filter((coord) => !visitedCoords.has(`${coord[0]},${coord[1]}`))
          .forEach((coord) => queue.push(coord));
      }
    }
  }

  getNumConnectedComponents() {
    let numConnectedComponents = 0;
    const visitedCoords = new Set();
    for (let row = 0; row < BOARD_SIDE_LENGTH; row++) {
      for (let col = 0; col < BOARD_SIDE_LENGTH; col++) {
        if (this._isPeg(row, col) && !visitedCoords.has(`${row},${col}`)) {
          numConnectedComponents++;
          this._bfs(row, col, visitedCoords);
        }
      }
    }
    return numConnectedComponents;
  }

  numPegsLeft() {
    return this.toString()
      .split("")
      .filter((c) => c === PEG_SQUARE).length;
  }

  toString() {
    return this._board.map((line) => line.join("")).join("\n");
  }

  equals(otherGame) {
    return this.toString().localeCompare(otherGame.toString()) === 0;
  }
}
