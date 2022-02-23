package com.mgatelabs.tools.utils;

/**
 * @author <a href="mailto:michael.fuller@sap.com">Michael Fuller</a>
 * Creation Date: Feb 22, 2022
 */
public enum Direction {
  N(0, 'N'),
  E(1, 'E'),
  S(2, 'S'),
  W(3, 'W'),

  ZERO(0, '0'),
  ONE(1, '1'),
  TWO(2, '2'),
  THREE(3, '3'),

  ANY(10, '*');

  public final int value;

  public final char identifier;

  Direction(int value, char ident) {
    this.value = value;
    this.identifier = ident;
  }

  public Direction next() {
    switch (this) {
      case N:
        return E;
      case E:
        return S;
      case S:
        return W;
      case W:
        return N;

      case ZERO:
        return ONE;
      case ONE:
        return TWO;
      case TWO:
        return THREE;
      case THREE:
        return ZERO;

      case ANY: // Any is special
        return ANY;
    }
    return N;
  }
}
