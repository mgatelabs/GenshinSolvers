# [JenshinSolver](https://mgatelabs.github.io/GenshinSolvers/)

Ever stood in front of a cube puzzle in Inazuma and thought to yourself: _I don' want to waste a [burst](https://www.reddit.com/r/Genshin_Impact/comments/op2p64/the_biggest_brain_in_inazuma/) [on this](https://www.youtube.com/watch?v=Qh8xvINAdqs)_

Then you've come to the right place! [Head over to the website and hunt down your puzzle](https://mgatelabs.github.io/GenshinSolvers/). Enter the initial configuration and follow the solution steps.

## Developer instructions

Clone the repository, the `Pages` branch is where the Angular code for the website is.

Then run

```
npm install
```

And finally, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

### `location_cubes.json`

```jsonc
{
    // ID of the puzzle
    "id": "x16786",
    // Location on the map
    "x": 3439.5,
    "y": 7177,
    // Number of cubes
    "count": "4",
    // "LIGHT" or "SPIN"
    "type": "LIGHT",
    // For three.js the location of the camera (left right, up down, close forward)
    "camera": [0, 1.0, 4],
    // Optional (TODO: What does it do?)
    "ortho": 9,
    // Which way does the player face
    "face": "N",
    // A helpful description
    "description": "This puzzle is on the ground outside of Amakumo Peak. There are 4 specters nearby.",
    // If I hit cube 0, then cube 1 will *also* get affected.
    "connection": [
      [1],
      [0, 2],
      [1, 3],
      [2]
    ],
    // The initial state, "1","2","3" for "LIGHT" puzzles
    // "N", "S", "E", "W" for "SPIN" puzzles
    "direction": ["1", "2", "3", "1"],
    // For three.js (TODO: documentation and how to setup slightly rotated and resized cubes?)
    "position": [
      [-4.5, -1, -1],
      [-0.8, 0, -1],
      [2, 0, -1],
      [5, 0, -1]
    ]
  },
```
