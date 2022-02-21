/**
 * Created by @mgatelabs (Michael Fuller) on 7/31/2021.
 */
public class Runner {

    public static void main(String [] args) {

        // Make the Puzzle which I want to solve.
        SpinPuzzle spinPuzzle = new SpinPuzzle();

        // Add the Cubes to the Puzzle
        SpinningCube a = spinPuzzle.addCube();
        SpinningCube b = spinPuzzle.addCube();
        SpinningCube c = spinPuzzle.addCube();
        SpinningCube d = spinPuzzle.addCube();
        SpinningCube e = spinPuzzle.addCube();

        // Set their initial direction
        a.setDirection(SpinningCube.Direction.N);
        b.setDirection(SpinningCube.Direction.N);
        c.setDirection(SpinningCube.Direction.N);
        d.setDirection(SpinningCube.Direction.E);
        e.setDirection(SpinningCube.Direction.W);

        // Now the tricky part, each cube when hit triggers 1 or more to also spin, so we need to connect each cube.

        // When I hit A, C moves
        a.connect(c);

        // When I hit B, A and C move
        b.connect(a);
        b.connect(c);

        c.connect(a);
        c.connect(e);

        d.connect(c);
        d.connect(e);

        e.connect(c);

        // I want them to all point E, eastward
        spinPuzzle.setWinningDirection(SpinningCube.Direction.E);

        int count = 0;

        // This will try to solve the puzzle using random ness, it should be fancy and use a generator that never retraces
        // it's path, but thats for another day.


        while (true) {
            if (spinPuzzle.attempt()) {
                // If I get a solution, stop
                break;
            }
            count++;
            if (count % 1000 == 0) {
                System.out.println("Loop: " + count);
            }
        }
    }

}
