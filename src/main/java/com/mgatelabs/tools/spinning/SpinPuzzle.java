package com.mgatelabs.tools.spinning;

import com.mgatelabs.tools.utils.BitHelper;
import com.mgatelabs.tools.utils.ConsoleColors;
import com.mgatelabs.tools.utils.Direction;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by @mgatelabs (Michael Fuller) on 7/31/2021.
 */
public class SpinPuzzle {

  private List<SpinningCube> cubes;

  private Direction winningDirection = Direction.ANY;

  private SecureRandom secureRandom = new SecureRandom();

  private int maxDepth = 8;

  private long iterations = 0;
  private long possibleSolutions = 0;

  public SpinPuzzle() {
    cubes = new ArrayList<>();
  }

  public int getMaxDepth() {
    return maxDepth;
  }

  public SpinPuzzle setMaxDepth(int maxDepth) {
    this.maxDepth = maxDepth;
    return this;
  }

  public void setWinningDirection(Direction winningDirection) {
    this.winningDirection = winningDirection;
  }

  public SpinningCube addCube() {
    SpinningCube spinningCube = new SpinningCube(cubes.size());
    cubes.add(spinningCube);
    return spinningCube;
  }

  public List<SpinningCube> addCubes(int count) {
    final List<SpinningCube> cubes = new ArrayList<>(count);
    for (int i = 0; i < count; i++) {
      cubes.add(addCube());
    }
    return cubes;
  }

  public SpinPuzzle connect(final int sourceIndex, final int... destIndexes) {
    if (sourceIndex >= 0 && sourceIndex < cubes.size()) {
      SpinningCube sourceCube = cubes.get(sourceIndex);
      for (int destIndex : destIndexes) {
        if (destIndex == sourceIndex) {
          throw new RuntimeException("Dest cube index " + destIndex + " is hitting itself");
        }
        if (sourceIndex >= 0 && sourceIndex < cubes.size()) {
          sourceCube.connect(cubes.get(destIndex));
        } else {
          throw new RuntimeException("Unknown Dest Cube Index, should be between 0 and " + (cubes.size() - 1));
        }
      }

    } else {
      throw new RuntimeException("Unknown Source Cube Index, should be between 0 and " + (cubes.size() - 1));
    }
    return this;
  }

  public SpinPuzzle setDirections(Direction... directions) {
    if (directions.length != cubes.size()) {
      throw new RuntimeException("The number of directions does not match the number of cubes: expected" + (cubes.size()) + " directions");
    }
    for (int i = 0; i < cubes.size(); i++) {
      cubes.get(i).setDirection(directions[i]);
    }
    return this;
  }

  /**
   * Solver
   * @param initialState The initial state of the cubes in bits
   * @param depth How far down am I?
   * @param limitDepth Extra limit to reduce searching too deep?
   * @return
   */
  public List<Integer> dig(long initialState, int depth, int limitDepth) {

    List<Integer> possibleResult = null;

    if (depth > limitDepth) {
      return null;
    }

    for (int i = 0; i < cubes.size(); i++) {
      // We only have 1 state object, so we need to re-load it a lot
      loadState(initialState);

      iterations++;
      cubes.get(i).hit();

      if (isSolved()) {
        possibleSolutions++;
        List<Integer> result = new ArrayList<>();
        result.add(i);
        return result;
      }

      if (depth < maxDepth) {
        List<Integer> result = dig(generateState(), depth + 1, (possibleResult != null) ? (depth + (possibleResult.size() - 1)) : limitDepth);

        if (result != null) {
          if ((possibleResult == null) || (result.size() + 1 < possibleResult.size())) {
            result.add(i);
            possibleResult = result;
          }
        }
      }
    }

    return possibleResult;
  }

  /**
   * Load the state from a long value
   *
   * @param state
   */
  private void loadState(long state) {
    for (int i = 0; i < cubes.size(); i++) {
      cubes.get(i).changeDirection(BitHelper.getDirectionFor(state, i));
    }
  }

  /**
   * Convert the current state to a long value
   *
   * @return
   */
  private long generateState() {
    long result = 0;
    for (int i = 0; i < cubes.size(); i++) {
      result += BitHelper.getBitsFor(cubes.get(i).getDirection(), i);
    }
    return result;
  }

  public boolean isSolved() {
    int goodCount = 0;
    final Direction check;
    if (winningDirection == Direction.ANY) {
      check = cubes.get(0).getDirection();
    } else {
      check = winningDirection;
    }
    for (SpinningCube cube : cubes) {
      if (cube.getDirection() == check) {
        goodCount++;
      }
    }
    return (goodCount == cubes.size());
  }

  public void printState(int highlight, List<SpinningCube> modified) {
    StringBuilder sb = new StringBuilder();
    sb.append("[");
    for (int i = 0; i < cubes.size(); i++) {
      if (i > 0) {
        sb.append("|");
      }
      if (i == highlight) {
        sb.append(ConsoleColors.RED);
      } else {
        boolean isModified = false;
        if (modified != null) {
          for (SpinningCube c : modified) {
            if (c.getMyIndex() == i) {
              isModified = true;
              break;
            }
          }
        }
        if (isModified) {
          sb.append(ConsoleColors.YELLOW);
        } else {
          sb.append(ConsoleColors.BLUE);
        }
      }
      sb.append(cubes.get(i).getDirection().identifier);
      sb.append(ConsoleColors.RESET);
    }
    sb.append("]");
    System.out.println(sb);
  }

  public void reset() {
    for (SpinningCube cube : cubes) {
      cube.reset();
    }
  }

  public boolean attempt() {

    // Cool Text Art https://fsymbols.com/generators/carty/

    System.out.println("\n" +
                           "\n" +
                           "░█████╗░██╗░░░██╗██████╗░███████╗  ░██████╗░█████╗░██╗░░░░░██╗░░░██╗███████╗██████╗░\n" +
                           "██╔══██╗██║░░░██║██╔══██╗██╔════╝  ██╔════╝██╔══██╗██║░░░░░██║░░░██║██╔════╝██╔══██╗\n" +
                           "██║░░╚═╝██║░░░██║██████╦╝█████╗░░  ╚█████╗░██║░░██║██║░░░░░╚██╗░██╔╝█████╗░░██████╔╝\n" +
                           "██║░░██╗██║░░░██║██╔══██╗██╔══╝░░  ░╚═══██╗██║░░██║██║░░░░░░╚████╔╝░██╔══╝░░██╔══██╗\n" +
                           "╚█████╔╝╚██████╔╝██████╦╝███████╗  ██████╔╝╚█████╔╝███████╗░░╚██╔╝░░███████╗██║░░██║\n" +
                           "░╚════╝░░╚═════╝░╚═════╝░╚══════╝  ╚═════╝░░╚════╝░╚══════╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝");

    System.out.println();
    System.out.println("\n" +
                           "█▄▄ █▄█   █▀▄▀█ █▀▀ ▄▀█ ▀█▀ █▀▀ █░░ ▄▀█ █▄▄ █▀\n" +
                           "█▄█ ░█░   █░▀░█ █▄█ █▀█ ░█░ ██▄ █▄▄ █▀█ █▄█ ▄█");

    reset();
    iterations = 0;

    List<Integer> result = dig(generateState(), 0, maxDepth);

    System.out.println();
    System.out.println("Please wait...");
    System.out.println();

    if (result != null) {

      System.out.println("\n" +
                             "░██████╗░█████╗░██╗░░░░░██╗░░░██╗████████╗██╗░█████╗░███╗░░██╗\n" +
                             "██╔════╝██╔══██╗██║░░░░░██║░░░██║╚══██╔══╝██║██╔══██╗████╗░██║\n" +
                             "╚█████╗░██║░░██║██║░░░░░██║░░░██║░░░██║░░░██║██║░░██║██╔██╗██║\n" +
                             "░╚═══██╗██║░░██║██║░░░░░██║░░░██║░░░██║░░░██║██║░░██║██║╚████║\n" +
                             "██████╔╝╚█████╔╝███████╗╚██████╔╝░░░██║░░░██║╚█████╔╝██║░╚███║\n" +
                             "╚═════╝░░╚════╝░╚══════╝░╚═════╝░░░░╚═╝░░░╚═╝░╚════╝░╚═╝░░╚══╝");

      System.out.println();
      System.out.println(possibleSolutions + " Solutions found after " + iterations + " attempts");
      System.out.println();

      reset();

      System.out.println("Initial Cube State");
      printState(-1, null);

      System.out.println("\n" +
                             "█▀▄▀█ █▀█ █░█ █▀▀ █▀\n" +
                             "█░▀░█ █▄█ ▀▄▀ ██▄ ▄█");

      StringBuilder sb = new StringBuilder();

      for (int i = 0; i < result.size(); i++) {
        int index = result.get(i);
        sb.setLength(0);
        sb.append("Hit #").append(i + 1).append(" - Cube Index [").append(index).append("] - Triggers [");

        SpinningCube target = cubes.get(index);

        boolean addComma = false;
        for (SpinningCube cube : target.getConnected()) {
          if (addComma) {
            sb.append(",");
          } else {
            addComma = true;
          }
          sb.append(cube.getMyIndex());
        }
        sb.append("]");

        System.out.println(sb.toString());
        target.hit();
        printState(index, target.getConnected());
      }

      System.out.println();
      System.out.println("\n" +
                             "█▄▀ █▀▀ █▄█\n" +
                             "█░█ ██▄ ░█░");
      System.out.println();
      System.out.println();


      System.out.println(ConsoleColors.BLUE + "Unmodified Cube" + ConsoleColors.RESET);
      System.out.println(ConsoleColors.RED + "Cube to Touch" + ConsoleColors.RESET);
      System.out.println(ConsoleColors.YELLOW + "Modified Because of Touch" + ConsoleColors.RESET);

      return true;
    } else {

      System.out.println("\n" +
                             "███████╗░█████╗░██╗██╗░░░░░██╗░░░██╗██████╗░███████╗\n" +
                             "██╔════╝██╔══██╗██║██║░░░░░██║░░░██║██╔══██╗██╔════╝\n" +
                             "█████╗░░███████║██║██║░░░░░██║░░░██║██████╔╝█████╗░░\n" +
                             "██╔══╝░░██╔══██║██║██║░░░░░██║░░░██║██╔══██╗██╔══╝░░\n" +
                             "██║░░░░░██║░░██║██║███████╗╚██████╔╝██║░░██║███████╗\n" +
                             "╚═╝░░░░░╚═╝░░╚═╝╚═╝╚══════╝░╚═════╝░╚═╝░░╚═╝╚══════╝");
      System.out.println();

      System.out.println("No solution found, maybe increase the max depth");
      return false;
    }
  }
}
