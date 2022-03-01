# GenshinSolvers
Tools to solve Genshin Impact puzzles

### The Website

Switch to the Pages-Dev branch

### How to use

This is for spinning and light up puzzles.

Open up the file src/main/java/com/mgatelabs/tools/Runner.java and make changes.

There are two example paths, one for Spinning and Light up puzzles.

Just uncomment the appropriate line and make changes to the related method.

The code has been optomized so you don't need to mess with variables, just setup the cubes, directions/lights and connections.

There is code to setup the winning direction, which is not needed for most puzzles, except for cases where one cube is "fixed".

Run the app and wait, it should find a solution, it will print out the order of the hits needed to solve the puzzle.

If it results in a failure, then the max depth variable in the puzzle may need to be increased.  The default depth is 8 hits.
