type PuzzleState = readonly number[];

type PuzzleDefinition = {
  /**
   * We represent the state with simple numbers
   */
  initialState: PuzzleState;

  /**
   * Did we reach the final state?
   */
  isFinalState: (state: PuzzleState) => boolean;

  /**
   * What's the maximum state (exclusive), before wrapping around.
   * 4 in the case of a rotating cube puzzle.
   */
  maximumNumber: number;

  /**
   * A state transition basically says "if we hit cube X then Y will be affected"
   */
  stateTransitions: number[][];
};

type PuzzleSolveStep = {
  previousStep: PuzzleSolveStep | null;
  touchedCube: number | null;
  state: PuzzleState;
};

function unifiedSolution(state: PuzzleState): boolean {
  return state.every((v) => v == state[0]);
}

function forcedSolution(direction: number): (state: PuzzleState) => boolean {
  return (state) => state.every((v) => v == direction);
}

function customSolution(
  finalState: PuzzleState
): (state: PuzzleState) => boolean {
  return (state) => state.every((v, i) => finalState[i] == v);
}

/**
 * Proper modulo, always returns a positive number
 */
function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

function solvePuzzle(puzzle: PuzzleDefinition) {
  // To prevent doing work more often than we have to
  const solvedStates = new Set<string>();

  // Which puzzle states can we reach and have not solved yet.
  const workQueue: PuzzleSolveStep[] = [];

  function addWork(step: PuzzleSolveStep) {
    const stateString = step.state.map((v) => v + '').join(',');
    if (!solvedStates.has(stateString)) {
      solvedStates.add(stateString);
      workQueue.push(step);
    }
  }

  addWork({
    previousStep: null,
    touchedCube: null,
    state: puzzle.initialState.slice(),
  });

  while (true) {
    // Take from the beginning of the queue
    let unsolved = workQueue.shift();
    if (unsolved === undefined) break;

    // Now apply every possible state transition
    for (let i = 0; i < puzzle.stateTransitions.length; i++) {
      const newState = unsolved.state.slice();

      // Apply the state transition
      puzzle.stateTransitions[i].forEach((affectedCube) => {
        newState[affectedCube] = mod(
          newState[affectedCube] + 1,
          puzzle.maximumNumber
        );
      });

      const newWork: PuzzleSolveStep = {
        previousStep: unsolved,
        touchedCube: i,
        state: newState,
      };

      // Check if it's a solution
      if (puzzle.isFinalState(newState)) {
        return newWork;
      }

      // Otherwise insert the new state as "work to do"
      addWork(newWork);
    }
  }

  return null;
}

export {
  solvePuzzle,
  customSolution,
  forcedSolution,
  unifiedSolution,
  PuzzleSolveStep,
  PuzzleDefinition,
  PuzzleState,
};
