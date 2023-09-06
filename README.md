# TOP-battleship

## What I've Learned

- To use beforeEach() with a variable in each test, define the variable in global scope eg `let newShip;`, assign it in the beforeEach() hook (`newShip = initialiseShip();`) and then use the variable in each test ( `newShip.()`).