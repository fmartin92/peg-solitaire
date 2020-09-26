export const UP = "up";
export const RIGHT = "right";
export const DOWN = "down";
export const LEFT = "left";

export const INVALID_SQUARE = " ";
export const EMPTY_SQUARE = ".";
export const PEG_SQUARE = "X";

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
    return this.getPossibleMoves().length === 0;
  }

  get(x, y) {
    return this._board[y][x];
  }

  _isValidMove(x, y, direction) {
    const [x1, y1] = this._computeDstSquare(x, y, direction);
    const [x2, y2] = this._computeDstSquare(x1, y1, direction);

    if (!this._isWithinBounds(x, y)) return false;
    if (!this._isWithinBounds(x2, y2)) return false;

    if (this.get(x, y) !== PEG_SQUARE) return false;
    if (this.get(x1, y1) !== PEG_SQUARE) return false;
    if (this.get(x2, y2) !== EMPTY_SQUARE) return false;

    return true;
  }

  _isWithinBounds(x, y) {
    return x >= 0 && x <= 6 && y >= 0 && y <= 6;
  }

  _isPeg(x, y) {
    return this._isWithinBounds(x, y) && this.get(x, y) === PEG_SQUARE;
  }

  _getNeighborPegs(x, y) {
    const neighborPegs = [];
    const addCoordIfNeighborPeg = (x, y) => {
      if (this._isPeg(x, y)) {
        neighborPegs.push([x, y]);
      }
    };
    addCoordIfNeighborPeg(x, y - 1);
    addCoordIfNeighborPeg(x + 1, y);
    addCoordIfNeighborPeg(x, y + 1);
    addCoordIfNeighborPeg(x - 1, y);
    return neighborPegs;
  }

  _bfs(x, y, visitedCoords) {
    const queue = [[x, y]];
    while (queue.length !== 0) {
      const [curX, curY] = queue.shift();
      const coordAsString = `${curX},${curY}`;
      if (!visitedCoords.has(coordAsString)) {
        visitedCoords.add(coordAsString);
        this._getNeighborPegs(curX, curY)
            .filter((coord) => !visitedCoords.has(`${coord[0]},${coord[1]}`))
            .forEach((coord) => queue.push(coord));
      }
    }
  }

  getNumConnectedComponents() {
    let numConnectedComponents = 0;
    const visitedCoords = new Set();
    for(let y = 0; y < 7; y++) {
      for(let x = 0; x < 7; x++) {
        if (this._isPeg(x, y) && !visitedCoords.has(`${x},${y}`)) {
          numConnectedComponents++;
          this._bfs(x, y, visitedCoords);
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
}
