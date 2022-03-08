import { PuzzleCube } from './puzzle-cube';
import { PuzzleDirection } from './puzzle-direction';
import { PuzzleType } from './puzzle-type';

export class PuzzleInfo {
  constructor(
    public id: String,
    public type: PuzzleType,
    public count: Number,
    public directions: Array<PuzzleDirection>,
    public connections: Array<Array<number>>
  ) {}
  public locationX = 0;
  public locationY = 0;
  public camera = [0, 3, 5];
  public position: Array<Array<number>> = [];
  public facing: PuzzleDirection = PuzzleDirection.NORTH;
  public description: string = 'No description';
  public orthoWidth: number = 12;
  public edit: Array<boolean> = [];
  public islandIndex: number = 0;

  getCubes(): Array<PuzzleCube> {
    let result = new Array<PuzzleCube>();

    for (let i = 0; i < this.count; i++) {
      let cube = new PuzzleCube(
        this.type,
        this.directions[i],
        this.connections[i]
      );

      result.push(cube);
    }

    return result;
  }
}
