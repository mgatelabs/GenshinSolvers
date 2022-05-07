import { ChouTreasureGridItem } from './chou-treasure-grid-item';
import { ChouTreasureTypes } from './chou-treasure-types';

declare type eachCallback = (
  x: number,
  y: number,
  item: ChouTreasureGridItem,
  neighbors: Array<ChouTreasureGridItem>
) => boolean;

export class ChouTreasureGrid {
  public grid: Array<Array<ChouTreasureGridItem>> = [];

  private static FAKEITEM: ChouTreasureGridItem = new ChouTreasureGridItem(
    0,
    0,
    ChouTreasureTypes.FAKE
  );

  constructor(previous: ChouTreasureGrid | undefined) {
    if (previous) {
      this.grid = previous.grid;
    } else {
      for (let y = 0; y < 5; y++) {
        this.grid.push([]);
        for (let x = 0; x < 5; x++) {
          this.grid[y].push(new ChouTreasureGridItem(x, y));
        }
      }
    }
  }

  private getSpot(x: number, y: number): ChouTreasureTypes {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureTypes.FAKE;
    }
    return this.grid[y][x].classification;
  }

  private getItem(x: number, y: number): ChouTreasureGridItem {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureGrid.FAKEITEM;
    }
    return this.grid[y][x];
  }

  private sniffSpot(x: number, y: number): ChouTreasureTypes {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureTypes.FAKE;
    }
    let value = this.grid[y][x].classification;

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

  public each(callback: eachCallback) {
    let again = true;
    while (again) {
      again = false;
      for (let y = 0; y < this.grid.length; y++) {
        for (let x = 0; x < this.grid.length; x++) {
          let nextTo: Array<ChouTreasureGridItem> = [];
          let temp = this.getItem(x, y - 1);
          if (temp.classification != ChouTreasureTypes.FAKE) {
            nextTo.push(temp);
          }
          temp = this.getItem(x, y + 1);
          if (temp.classification != ChouTreasureTypes.FAKE) {
            nextTo.push(temp);
          }
          temp = this.getItem(x - 1, y);
          if (temp.classification != ChouTreasureTypes.FAKE) {
            nextTo.push(temp);
          }
          temp = this.getItem(x + 1, y);
          if (temp.classification != ChouTreasureTypes.FAKE) {
            nextTo.push(temp);
          }
          if (callback(x, y, this.grid[y][x], nextTo)) {
            again = true;
          }
        }
      }
    }
  }

  private sniffSpot2(x: number, y: number): ChouTreasureTypes {
    if (x < 0 || x >= 5 || y < 0 || y >= 5) {
      return ChouTreasureTypes.FAKE;
    }
    let value = this.grid[y][x].classification;

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
      this.grid[y][x].classification = value;
    }
  }

  public updateSpot(x: number, y: number) {
    this.clean();

    let currentValue = this.grid[y][x].classification;
    let futureValue = ChouTreasureTypes.EMPTY;
    switch (currentValue) {
      case ChouTreasureTypes.EMPTY:
        futureValue = ChouTreasureTypes.CABBAGE;
        break;
      case ChouTreasureTypes.CABBAGE:
        futureValue = ChouTreasureTypes.ORE;
        break;
      case ChouTreasureTypes.ORE:
        futureValue = ChouTreasureTypes.UNKNOWN;
        break;
      default:
        futureValue = ChouTreasureTypes.EMPTY;
        break;
    }
    this.grid[y][x].classification = futureValue;
    // This cell has been interacted with
    this.grid[y][x].user =
      this.grid[y][x].classification != ChouTreasureTypes.UNKNOWN;

    let g = this.grid;

    // Mark Safe Columns

    this.each((x, y, item, neighbors) => {
      if (item.classification == ChouTreasureTypes.EMPTY) {
        for (let nextTo of neighbors) {
          nextTo.safe = true;
          if (nextTo.classification == ChouTreasureTypes.UNKNOWN) {
            //console.log(`Mark Safe (${nextTo.x},${nextTo.y})`);
            nextTo.classification = ChouTreasureTypes.SAFE_SPOT;
          }
        }
      }
      return false;
    });
    // Count the number of bombs are wanted for each tile
    this.each((x, y, item, neighbors) => {
      if (item.solved) {
        return false;
      }

      if (
        item.classification == ChouTreasureTypes.CABBAGE ||
        item.classification == ChouTreasureTypes.ORE
      ) {
        if (
          item.classification == ChouTreasureTypes.ORE &&
          neighbors.length == 2
        ) {
          // If the Ore is on the Edge, the two adjancent tiles are bombs
          item.solved = true;
          for (let nextTo of neighbors) {
            nextTo.classification = ChouTreasureTypes.BOMB;
            nextTo.safe = false;
            nextTo.edgeBombs += 100;
          }
        } else {
          let desiredBombs: number =
            item.classification == ChouTreasureTypes.CABBAGE ? 1 : 2;

          let availableTiles: number = 0;
          let bombTiles: number = 0;
          let availableItems: Array<ChouTreasureGridItem> = [];
          for (let nextTo of neighbors) {
            if (nextTo.classification == ChouTreasureTypes.BOMB) {
              bombTiles++;
              //availableTiles++;
            } else if (nextTo.safe == true || nextTo.user == true) {
              // Skip. this tile is safe or user set, which can't be a bomb
            } else {
              availableTiles++;
              availableItems.push(nextTo);
            }
          }

          if (desiredBombs == bombTiles) {
            // My needs are satisified, every other tile should be freed
            item.solved = true;
            for (let nextTo of availableItems) {
              nextTo.classification = ChouTreasureTypes.SAFE_SPOT;
            }
          } else if (
            (bombTiles == 0 && availableTiles == desiredBombs) ||
            (bombTiles > 0 &&
              availableTiles > 0 &&
              availableTiles == desiredBombs - bombTiles)
          ) {
            item.solved = true;
            // The next door neighbors are actually bombs
            for (let nextTo of availableItems) {
              nextTo.classification = ChouTreasureTypes.BOMB;
            }
            return true;
          } else {
            let magnitude: number = 25;
            switch (availableItems.length) {
              case 1:
                {
                  magnitude = 100;
                }
                break;
              case 2:
                {
                  magnitude = 50;
                }
                break;
              case 3:
                {
                  magnitude = 33;
                }
                break;
            }
            for (let nextTo of availableItems) {
              nextTo.classification = ChouTreasureTypes.POTENTIAL_BOMB;
              nextTo.edgeBombs += magnitude;
            }
          }
        }
      }
      return false;
    });

    // Fix things
    this.each((x, y, item, neighbors) => {
      if (
        item.solved == false &&
        item.classification == ChouTreasureTypes.CABBAGE
      ) {
        let lowEffort: Array<ChouTreasureGridItem> = [];

        let availableItems: Array<ChouTreasureGridItem> = [];
        for (let nextTo of neighbors) {
          if (nextTo.classification == ChouTreasureTypes.BOMB) {
          } else if (nextTo.safe == true || nextTo.user == true) {
            // Skip. this tile is safe or user set, which can't be a bomb
          } else {
            if (nextTo.edgeBombs <= 50) {
              lowEffort.push(nextTo);
            }
            availableItems.push(nextTo);
          }
        }
        if (availableItems.length > lowEffort.length) {
          for (let nextTo of lowEffort) {
            nextTo.classification = ChouTreasureTypes.SAFE_SPOT;
            nextTo.edgeBombs = 0;
          }
        }
      } else if (
        item.solved == false &&
        item.classification == ChouTreasureTypes.UNKNOWN
      ) {
        let bombTiles: number = 0;
        for (let nextTo of neighbors) {
          if (nextTo.classification == ChouTreasureTypes.BOMB) {
            bombTiles++;
          }
        }
        if (bombTiles == neighbors.length) {
          item.classification = ChouTreasureTypes.TREASURE;
        }
      }
      return false;
    });

    /*
    for (y = 0; y < g.length; y++) {
      for (x = 0; x < g.length; x++) {
        currentValue = g[y][x].classification;

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
          currentValue = g[y][x].classification;

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
    */
  }

  public reset() {
    for (let y = 0; y < this.grid!.length; y++) {
      for (let x = 0; x < this.grid![y].length; x++) {
        let item = this.grid[y][x];
        item.reset();
        item.user = false;
        item.classification = ChouTreasureTypes.UNKNOWN;
      }
    }
  }

  public clean() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        let item = this.grid[y][x];
        item.reset();
        switch (item.classification) {
          case ChouTreasureTypes.EMPTY:
          case ChouTreasureTypes.CABBAGE:
          case ChouTreasureTypes.ORE:
            break;
          default:
            item.classification = ChouTreasureTypes.UNKNOWN;
            break;
        }
      }
    }
  }
}
