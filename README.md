# TOP-battleship

![image](https://github.com/prodijay777/TOP-battleship/assets/105083538/e0415e19-afb6-4e03-9895-d6380db336e2)

![image](https://github.com/prodijay777/TOP-battleship/assets/105083538/2e651224-3552-4c35-be6e-962f69f29e25)

Live link: https://prodijay777.github.io/TOP-battleship/

The intent of this project was to learn how to use Jest. I felt that this was achieved, however I could have benefitted by learning how to mock tests a little more.

I was a little rusty with connecting DOM and game logic, so much of the project was spent trying to figure out how to manipulate the DOM, such as flipping the ship orientation, and replacing ships. If I revisit this project, I'd like to decouple this code and separate concerns more cleanly.

## What I've Learned

- To keep functions pure when testing, define the requirments within the test scope, rather than outside the test scope. e.g. define objects within the tests.

- To use beforeEach() with a variable in each test, define the variable in global scope eg `let newShip;`, assign it in the beforeEach() hook (`newShip = initialiseShip();`) and then use the variable in each test ( `newShip.()`).

- For functions that check something, eg. checkIfPlaced() checks if hasShip property is true, it is good practice to cover all branches. This means return true, or return false, rather than just returning true.

- Using `Class extends` to create a subclass, requires using `super()` in `constructor()`.

- Use of HTML template to use font awesome icon with webpack. Requires template to be on the outer level of HTML page.

## To Work On

- Improve Computer playmaking by making moves in nearby spaces, if a successful play was made.
- Implement 'play again' button.
- Continue the current player's turn if a successful play was made.
- Decouple tightly-coupled code in displayController, perhaps by introducing a new module to handle initial-grid logic.
- Disable player board whilst computer turn is occuring.
- Disable start button if player decides to replace/move a ship.
- Implement two-player mode.
- Implement random placement for player.
- Fix strange adjustment to grid alignment when making a move.

## References
The color scheme was inspired by Samuel Honigstein's Arkade London:
https://www.awwwards.com/sites/arkade-london-audio-reactive-art#details
