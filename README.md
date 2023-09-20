# TOP-battleship

## What I've Learned

- To keep functions pure when testing, define the requirments within the test scope, rather than outside the test scope. e.g. define objects within the tests.

- To use beforeEach() with a variable in each test, define the variable in global scope eg `let newShip;`, assign it in the beforeEach() hook (`newShip = initialiseShip();`) and then use the variable in each test ( `newShip.()`).

- For functions that check something, eg. checkIfPlaced() checks if hasShip property is true, it is good practice to cover all branches. This means return true, or return false, rather than just returning true.

- Using `Class extends` to create a subclass, requires using `super()` in `constructor()`.

- Use of HTML template to use font awesome icon with webpack. Requires template to be on the outer level of HTML page.