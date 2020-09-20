export const UP = "up";
export const RIGHT = "right";
export const DOWN = "down";
export const LEFT = "left";

const INVALID_SQUARE = " ";
const EMPTY_SQUARE = ".";
const PEG_SQUARE = "X";

const INITIAL_BOARD = [
  "  XXX  ",
  "  XXX  ",
  "XXXXXXX",
  "XXX.XXX",
  "XXXXXXX",
  "  XXX  ",
  "  XXX  ",
].map((line) => line.split(""));

const BOARD_SIDE_LENGTH = 7;

const deepCopy = (object) => JSON.parse(JSON.stringify(object));

export class Game {
  constructor(board) {
    this._board = board ? board : deepCopy(INITIAL_BOARD);
  }

  _computeDstSquare(x, y, direction) {
    let dstX = x,
      dstY = y;

    switch (direction) {
      case UP:
        dstY--;
        break;
      case RIGHT:
        dstX++;
        break;
      case DOWN:
        dstY++;
        break;
      case LEFT:
        dstX--;
        break;
      default:
        throw new Error(`${direction} is not a valid direction`);
    }

    return [dstX, dstY];
  }

  move(x, y, direction) {
    if (!this._isValidMove(x, y, direction)) {
      throw new Error("Invalid move");
    }

    const [x1, y1] = this._computeDstSquare(x, y, direction);
    const [x2, y2] = this._computeDstSquare(x1, y1, direction);

    const newBoard = deepCopy(this._board);
    const set = (x, y, value) => (newBoard[y][x] = value);

    set(x, y, EMPTY_SQUARE);
    set(x1, y1, EMPTY_SQUARE);
    set(x2, y2, PEG_SQUARE);

    return new Game(newBoard);
  }

  getPossibleMoves() {
    const moves = [];

    for (let y = 0; y < BOARD_SIDE_LENGTH; y++) {
      for (let x = 0; x < BOARD_SIDE_LENGTH; x++) {
        [UP, RIGHT, DOWN, LEFT].forEach((direction) => {
          if (this._isValidMove(x, y, direction)) {
            moves.push(this.move(x, y, direction));
          }
        });
      }
    }

    return moves;
  }

  isOver() {
    return this.getPossibleMoves().length == 0;
  }

  _get(x, y) {
    return this._board[y][x];
  }

  _isValidMove(x, y, direction) {
    const [x1, y1] = this._computeDstSquare(x, y, direction);
    const [x2, y2] = this._computeDstSquare(x1, y1, direction);

    const isValidSquare = (x, y) => x >= 0 && x <= 6 && y >= 0 && y <= 6;

    if (!isValidSquare(x, y)) return false;
    if (!isValidSquare(x2, y2)) return false;

    if (this._get(x, y) !== PEG_SQUARE) return false;
    if (this._get(x1, y1) !== PEG_SQUARE) return false;
    if (this._get(x2, y2) !== EMPTY_SQUARE) return false;

    return true;
  }

  numPegsLeft() {
    return this.toString()
      .split("")
      .filter((c) => c == PEG_SQUARE).length;
  }

  toString() {
    return this._board.map((line) => line.join("")).join("\n");
  }
}
