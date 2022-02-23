package com.mgatelabs.tools.spinning;

import com.mgatelabs.tools.utils.Direction;

import java.util.ArrayList;
import java.util.List;

/**
 * Used to Represent a Spinning Cube that rotates freely.  Not one of those static ones
 *
 * Created by @mgatelabs (Michael Fuller) on 7/31/2021.
 */
public class SpinningCube {

    private final int myIndex;

    public SpinningCube(int myIndex) {
        this.myIndex = myIndex;
        this.connected = new ArrayList<>();
    }

    public int getMyIndex() {
        return myIndex;
    }

    private List<SpinningCube> connected;

    private Direction defaultDirection = Direction.N;
    private Direction direction = Direction.N;

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
        defaultDirection = direction;
    }

    public void changeDirection(Direction direction) {
        this.direction = direction;
    }

    public void reset() {
        this.direction = defaultDirection;
    }

    public void connect(SpinningCube ... cubes) {
        for (SpinningCube cube: cubes) {
            this.connected.add(cube);
        }
    }

    public List<SpinningCube> getConnected() {
        return connected;
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
