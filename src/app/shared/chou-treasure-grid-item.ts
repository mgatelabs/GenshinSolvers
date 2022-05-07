import { ChouTreasureTypes } from './chou-treasure-types';

export class ChouTreasureGridItem {
  public edgeBombs: number = 0;
  public edgeUnknown: number = 0;
  public safe: boolean = false;
  public solved: boolean = false;
  public user: boolean = false;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public classification: ChouTreasureTypes = ChouTreasureTypes.UNKNOWN
  ) {}

  public reset() {
    this.edgeBombs = 0;
    this.edgeUnknown = 0;
    this.safe = false;
    this.solved = false;
  }
}
