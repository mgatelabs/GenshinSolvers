import { PuzzleDirection } from './puzzle-direction';
import { PuzzleType } from './puzzle-type';

export class PuzzleConfiguration {
  constructor(
    public puzzleType: PuzzleType,
    public directions: Array<PuzzleDirection>
  ) {}

  public rotateIndex(index: number, isLeft: boolean): boolean {
    if (index >= 0 && index < this.directions.length) {
      let initial = this.directions[index];
      let next = initial;
      if (isLeft) {
        next = this.getPreviousDirection(initial);
      } else {
        next = this.getNextDirection(initial);
      }
      if (next != initial) {
        this.directions[index] = next;
        return true;
      }
    }
    return false;
  }

  private getNextDirection(value: PuzzleDirection): PuzzleDirection {
    switch (value) {
      case PuzzleDirection.NORTH:
        return PuzzleDirection.EAST;
      case PuzzleDirection.EAST:
        return PuzzleDirection.SOUTH;
      case PuzzleDirection.SOUTH:
        return PuzzleDirection.WEST;
      case PuzzleDirection.WEST:
        return PuzzleDirection.NORTH;

      case PuzzleDirection.ZERO:
        return PuzzleDirection.ONE;
      case PuzzleDirection.ONE:
        return PuzzleDirection.TWO;
      case PuzzleDirection.TWO:
        return PuzzleDirection.THREE;
      case PuzzleDirection.THREE:
        return PuzzleDirection.ZERO;
    }
    return PuzzleDirection.NORTH;
  }

  private getPreviousDirection(value: PuzzleDirection): PuzzleDirection {
    switch (value) {
      case PuzzleDirection.NORTH:
        return PuzzleDirection.WEST;
      case PuzzleDirection.EAST:
        return PuzzleDirection.NORTH;
      case PuzzleDirection.SOUTH:
        return PuzzleDirection.EAST;
      case PuzzleDirection.WEST:
        return PuzzleDirection.SOUTH;

      case PuzzleDirection.ZERO:
        return PuzzleDirection.THREE;
      case PuzzleDirection.ONE:
        return PuzzleDirection.ZERO;
      case PuzzleDirection.TWO:
        return PuzzleDirection.ONE;
      case PuzzleDirection.THREE:
        return PuzzleDirection.TWO;
    }
    return PuzzleDirection.NORTH;
  }
}
