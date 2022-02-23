package com.mgatelabs.tools;

import com.mgatelabs.tools.spinning.SpinPuzzle;
import com.mgatelabs.tools.utils.Direction;

/**
 * Created by @mgatelabs (Michael Fuller) on 7/31/2021.
 */
public class Runner {

  // Because Indexes are hard
  public static int A = 0;
  public static int B = 1;
  public static int C = 2;
  public static int D = 3;
  public static int E = 4;
  public static int F = 5;
  public static int G = 6;
  public static int H = 7;

  public static void main(String[] args) {
    solveCubePuzzle();
    //solveLightPuzzle();
  }

  /**
   *
   */
  public static void solveCubePuzzle() {
    // Make the Puzzle which I want to solve.
    SpinPuzzle spinPuzzle = new SpinPuzzle();

    // Add the Cubes to the Puzzle
    spinPuzzle.addCubes(5);

    // Set their initial direction
    spinPuzzle.setDirections(Direction.N, Direction.N, Direction.N, Direction.E, Direction.W);

    // Now the tricky part, each cube when hit triggers 1 or more to also spin, so we need to connect each cube.

    // When I hit A, C moves
    spinPuzzle.connect(A, C);

    // When I hit B, A and C move
    spinPuzzle.connect(B, A, C);

    spinPuzzle.connect(C, A, E);

    spinPuzzle.connect(D, C, E);

    spinPuzzle.connect(E, C);

    // I don't care which way they face, they just all need to face the same way
    spinPuzzle.setWinningDirection(Direction.ANY);

    spinPuzzle.attempt();
  }

  public static void solveLightPuzzle() {
    // Make the Puzzle which I want to solve.
    SpinPuzzle spinPuzzle = new SpinPuzzle();

    // Add the Cubes to the Puzzle
    spinPuzzle.addCubes(3);

    // Set their initial light counts
    spinPuzzle.setDirections(Direction.ONE, Direction.TWO, Direction.ZERO);

    // Now the tricky part, each cube when hit triggers 1 or more to also shift, so we need to connect each cube.

    // When I hit A, B moves
    spinPuzzle.connect(A, B);

    // When I hit B, A and C move
    spinPuzzle.connect(B, A, C);

    spinPuzzle.connect(C, B);

    // I don't care which way they face, they just all need to face the same way
    spinPuzzle.setWinningDirection(Direction.ANY);

    spinPuzzle.attempt();
  }

}
