import java.util.ArrayList;
import java.util.List;

/**
 * Used to Represent a Spinning Cube that rotates freely.  Not one of those static ones
 *
 * Created by @mgatelabs (Michael Fuller) on 7/31/2021.
 */
public class SpinningCube {

    private List<SpinningCube> connected;


    public static enum Direction {
        N, E, S, W;

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
            }
            return N;
        }
    }

    private Direction defaultDirection = Direction.N;
    private Direction direction = Direction.N;

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
        defaultDirection = direction;
    }

    public void reset() {
        this.direction = defaultDirection;
    }

    public SpinningCube() {
        this.connected = new ArrayList<>();
    }

    public void connect(SpinningCube cube) {
        this.connected.add(cube);
    }

    public void hit() {
        this.turn();
        for (SpinningCube cube : connected) {
            cube.turn();
        }
    }

    public void turn() {
        this.direction = direction.next();
    }
}
