import { PuzzleDirection } from './puzzle-direction';
import { PuzzleType } from './puzzle-type';

export class PuzzleCube {
  constructor(
    public type: PuzzleType,
    public direction: PuzzleDirection,
    public connections: Array<Number>
  ) {}
}
