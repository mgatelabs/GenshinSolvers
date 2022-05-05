import { ChouTreasureTypes } from './chou-treasure-types';

export class ChouTreasureGrid {
  public grid: Array<Array<ChouTreasureTypes>> = [[]];

  constructor(previous: ChouTreasureGrid | undefined) {
    if (previous) {
      this.grid = previous.grid;
    } else {
      this.grid = [
        [
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
        ],
        [
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
        ],
        [
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
        ],
        [
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
        ],
        [
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
          ChouTreasureTypes.UNKNOWN,
        ],
      ];
    }
  }

  private getSpot(x: number, y: number): ChouTreasureTypes {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureTypes.FAKE;
    }
    return this.grid[y][x];
  }

  private sniffSpot(x: number, y: number): ChouTreasureTypes {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureTypes.FAKE;
    }
    let value = this.grid[y][x];

    switch (value) {
      case ChouTreasureTypes.ORE:
      case ChouTreasureTypes.CABBAGE:
      case ChouTreasureTypes.EMPTY:
      case ChouTreasureTypes.BOMB:
        return value;
      default:
        return ChouTreasureTypes.UNKNOWN;
    }
  }

  private sniffSpot2(x: number, y: number): ChouTreasureTypes {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureTypes.FAKE;
    }
    let value = this.grid[y][x];

    switch (value) {
      case ChouTreasureTypes.ORE:
      case ChouTreasureTypes.CABBAGE:
      case ChouTreasureTypes.EMPTY:
      case ChouTreasureTypes.BOMB:
      case ChouTreasureTypes.SAFE_SPOT:
      case ChouTreasureTypes.TREASURE:
        return value;
      default:
        return ChouTreasureTypes.UNKNOWN;
    }
  }

  private forceSpot(x: number, y: number, value: ChouTreasureTypes) {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
    } else {
      this.grid[y][x] = value;
    }
  }

  public updateSpot(x: number, y: number) {
    this.clean();

    let currentValue = this.grid[y][x];
    let futureValue = ChouTreasureTypes.EMPTY;
    switch (currentValue) {
      case ChouTreasureTypes.EMPTY:
        futureValue = ChouTreasureTypes.CABBAGE;
        break;
      case ChouTreasureTypes.CABBAGE:
        futureValue = ChouTreasureTypes.ORE;
        break;
      default:
        futureValue = ChouTreasureTypes.EMPTY;
        break;
    }
    this.grid[y][x] = futureValue;

    let g = this.grid;

    for (y = 0; y < g.length; y++) {
      for (x = 0; x < g.length; x++) {
        currentValue = g[y][x];

        let up = this.sniffSpot(x, y - 1);
        let down = this.sniffSpot(x, y + 1);
        let left = this.sniffSpot(x - 1, y);
        let right = this.sniffSpot(x + 1, y);

        switch (currentValue) {
          case ChouTreasureTypes.EMPTY:
            {
              if (up == ChouTreasureTypes.UNKNOWN) {
                this.forceSpot(x, y - 1, ChouTreasureTypes.SAFE_SPOT);
              }
              if (down == ChouTreasureTypes.UNKNOWN) {
                this.forceSpot(x, y + 1, ChouTreasureTypes.SAFE_SPOT);
              }
              if (left == ChouTreasureTypes.UNKNOWN) {
                this.forceSpot(x - 1, y, ChouTreasureTypes.SAFE_SPOT);
              }
              if (right == ChouTreasureTypes.UNKNOWN) {
                this.forceSpot(x + 1, y, ChouTreasureTypes.SAFE_SPOT);
              }
            }
            break;
          default:
        }
      }
    }

    for (let z = 0; z < 4; z++) {
      let changed = false;
      for (y = 0; y < g.length; y++) {
        for (x = 0; x < g.length; x++) {
          currentValue = g[y][x];

          let up = this.sniffSpot2(x, y - 1);
          let down = this.sniffSpot2(x, y + 1);
          let left = this.sniffSpot2(x - 1, y);
          let right = this.sniffSpot2(x + 1, y);

          let unknownCount = 0;
          let bombCount = 0;

          if (up == ChouTreasureTypes.UNKNOWN) {
            unknownCount++;
          }
          if (down == ChouTreasureTypes.UNKNOWN) {
            unknownCount++;
          }
          if (left == ChouTreasureTypes.UNKNOWN) {
            unknownCount++;
          }
          if (right == ChouTreasureTypes.UNKNOWN) {
            unknownCount++;
          }

          if (up == ChouTreasureTypes.BOMB) {
            bombCount++;
          }
          if (down == ChouTreasureTypes.BOMB) {
            bombCount++;
          }
          if (left == ChouTreasureTypes.BOMB) {
            bombCount++;
          }
          if (right == ChouTreasureTypes.BOMB) {
            bombCount++;
          }

          switch (currentValue) {
            case ChouTreasureTypes.UNKNOWN:
              if (bombCount == 4) {
                this.forceSpot(x, y, ChouTreasureTypes.TREASURE);
                changed = true;
              }
              break;
            case ChouTreasureTypes.CABBAGE: // 1
              {
                if (bombCount == 1) {
                  if (up == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x, y - 1, ChouTreasureTypes.SAFE_SPOT);
                    changed = true;
                  }
                  if (down == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x, y + 1, ChouTreasureTypes.SAFE_SPOT);
                    changed = true;
                  }
                  if (left == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x - 1, y, ChouTreasureTypes.SAFE_SPOT);
                    changed = true;
                  }
                  if (right == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x + 1, y, ChouTreasureTypes.SAFE_SPOT);
                    changed = true;
                  }
                } else {
                  // No Known Bombs
                  if (unknownCount == 1) {
                    if (up == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x, y - 1, ChouTreasureTypes.BOMB);
                      changed = true;
                    } else if (down == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x, y + 1, ChouTreasureTypes.BOMB);
                      changed = true;
                    } else if (left == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x - 1, y, ChouTreasureTypes.BOMB);
                      changed = true;
                    } else if (right == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x + 1, y, ChouTreasureTypes.BOMB);
                      changed = true;
                    }
                  } else {
                    if (up == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x,
                        y - 1,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                      changed = true;
                    }
                    if (down == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x,
                        y + 1,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                      changed = true;
                    }
                    if (left == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x - 1,
                        y,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                      changed = true;
                    }
                    if (right == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x + 1,
                        y,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                      changed = true;
                    }
                  }
                }
              }
              break;
            case ChouTreasureTypes.ORE: // 2
              {
                if (bombCount == 1) {
                  if (up == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x, y - 1, ChouTreasureTypes.POTENTIAL_BOMB);
                  }
                  if (down == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x, y + 1, ChouTreasureTypes.POTENTIAL_BOMB);
                  }
                  if (left == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x - 1, y, ChouTreasureTypes.POTENTIAL_BOMB);
                  }
                  if (right == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x + 1, y, ChouTreasureTypes.POTENTIAL_BOMB);
                  }
                } else if (bombCount == 2) {
                  if (up == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x, y - 1, ChouTreasureTypes.SAFE_SPOT);
                  }
                  if (down == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x, y + 1, ChouTreasureTypes.SAFE_SPOT);
                  }
                  if (left == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x - 1, y, ChouTreasureTypes.SAFE_SPOT);
                  }
                  if (right == ChouTreasureTypes.UNKNOWN) {
                    this.forceSpot(x + 1, y, ChouTreasureTypes.SAFE_SPOT);
                  }
                } else {
                  // No Known Bombs
                  if (unknownCount == 1) {
                    if (up == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x, y - 1, ChouTreasureTypes.BOMB);
                    } else if (down == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x, y + 1, ChouTreasureTypes.BOMB);
                    } else if (left == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x - 1, y, ChouTreasureTypes.BOMB);
                    } else if (right == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x + 1, y, ChouTreasureTypes.BOMB);
                    }
                  } else if (unknownCount == 2) {
                    if (up == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x, y - 1, ChouTreasureTypes.BOMB);
                    }
                    if (down == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x, y + 1, ChouTreasureTypes.BOMB);
                    }
                    if (left == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x - 1, y, ChouTreasureTypes.BOMB);
                    }
                    if (right == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(x + 1, y, ChouTreasureTypes.BOMB);
                    }
                  } else {
                    if (up == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x,
                        y - 1,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                    }
                    if (down == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x,
                        y + 1,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                    }
                    if (left == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x - 1,
                        y,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                    }
                    if (right == ChouTreasureTypes.UNKNOWN) {
                      this.forceSpot(
                        x + 1,
                        y,
                        ChouTreasureTypes.POTENTIAL_BOMB
                      );
                    }
                  }
                }
              }
              break;
            default:
              break;
          }
        }
      }
      if (!changed) {
        break;
      }
    }
  }

  public reset() {
    for (let y = 0; y < this.grid!.length; y++) {
      for (let x = 0; x < this.grid![y].length; x++) {
        this.grid![y][x] = ChouTreasureTypes.UNKNOWN;
      }
    }
  }

  public clean() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        switch (this.grid[y][x]) {
          case ChouTreasureTypes.EMPTY:
          case ChouTreasureTypes.CABBAGE:
          case ChouTreasureTypes.ORE:
            break;
          default:
            this.grid[y][x] = ChouTreasureTypes.UNKNOWN;
            break;
        }
      }
    }
  }
}
