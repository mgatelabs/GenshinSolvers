import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by @mgatelabs (Michael Fuller) on 7/31/2021.
 */
public class SpinPuzzle {

    private List<SpinningCube> cubes;

    private SpinningCube.Direction winningDirection = SpinningCube.Direction.S;

    private SecureRandom secureRandom = new SecureRandom();

    public SpinPuzzle() {
        cubes = new ArrayList<>();
    }

    public void setWinningDirection(SpinningCube.Direction winningDirection) {
        this.winningDirection = winningDirection;
    }

    public SpinningCube addCube() {
        SpinningCube spinningCube = new SpinningCube();
        cubes.add(spinningCube);
        return spinningCube;
    }

    public boolean attempt() {
        for (SpinningCube cube : cubes) {
            cube.reset();
        }

        List<Integer> results = new ArrayList<>(20);

        for (int i = 0; i < 20; i++) {
            int target = secureRandom.nextInt(cubes.size());
            results.add(target);

            cubes.get(target).hit();

            int goodCount = 0;
            for (SpinningCube cube : cubes) {
                if (cube.getDirection() == winningDirection) {
                    goodCount++;
                }
            }
            if (goodCount == cubes.size()) {
                for (int value : results) {
                    System.out.println(value);
                }
                return true;
            }
        }
        return false;
    }
}
