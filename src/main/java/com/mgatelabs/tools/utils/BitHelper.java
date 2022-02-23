package com.mgatelabs.tools.utils;

/**
 * Because Bits are hard
 *
 * @author <a href="mailto:michael.fuller@sap.com">Michael Fuller</a>
 * Creation Date: Feb 22, 2022
 */
public class BitHelper {

  public static final int MAX_CUBES = 9;

  public static long getBitsFor(final Direction direction, final int index) {
    if (index >= 0 && index < MAX_CUBES) {
      return ((long) direction.value) << (index * 2);
    }
    throw new RuntimeException("Invalid cube index");
  }

  public static Direction getDirectionFor(long value, int index) {
    if (index >= 0 && index < MAX_CUBES) {
      long altered = value >> (index * 2);
      switch ((short) (altered & 0x03)) {
        case 0:
          return Direction.N;
        case 1:
          return Direction.E;
        case 2:
          return Direction.S;
        default:
          return Direction.W;
      }
    }
    throw new RuntimeException("Invalid cube index");
  }

}
