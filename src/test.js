import { Ship, initialiseShip } from "./ship.js";
import { Gameboard } from "./gameboard.js";

// let's be clear; 
// the first argument refers to the column number. 
// the second argument refers to the row number. 
let newShip;
let newGameboard

beforeEach(() => {
    // newShip = new Ship(4)
    newShip = initialiseShip(4)
    newGameboard = new Gameboard()
})

test('test invalid Ship construction', () => {
    newShip = initialiseShip(5);
    expect(newShip).toBe(undefined);
})
test('test if Ship is hit', () => {
    newShip.hit()
    expect(newShip.hits).toBe(1);
})

test('test if Ship is sunk', () => {
    newShip.hit()
    newShip.hit()
    newShip.hit()
    newShip.hit()
    newShip.isSunk()
    expect(newShip.sunk).toBe(true);
})

test('place ship in coordinate', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    expect(newGameboard.getPosition(1,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(2,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(3,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(4,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(5,3).hasShip).toBe(false)
})

test('ship receives a hit with receiveAttack', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(1,3)
    let hitShip = newGameboard.getShip(1,3)
    expect(hitShip.hits).toBe(1)

    // i may have to expand on this bit, cus im confused
    // i wasn't expecting a hit on a different position, to correspond to the same ship... that's nuts if true
    newGameboard.receiveAttack(2,3)
    hitShip = newGameboard.getShip(2,3)
    // what? how does this work???
    expect(hitShip.hits).toBe(2)
})

test('miss a hit with receiveAttack', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(8,3)
    //what to expect
    expect(newGameboard.getPosition(8,3).missedHit).toBe(true)
})

test('check that using placeShip() on the same coordinate is not allowed', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    expect(
        newGameboard.placeShip(4, 'horizontal', [1,3])
    )
    .toBe('position already occupied')
})

test('check that using receiveAttack() on the same coordinate is not allowed', () => {
    newGameboard.receiveAttack(8,3)
    expect(
        newGameboard.receiveAttack(8,3)
    )
    .toBe('already attacked')
})

test('store all missed hit coordinates', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(8,3)
    newGameboard.receiveAttack(1,3)
    newGameboard.receiveAttack(5,5)
    
    //work on storing coordinates
    expect(newGameboard.guessedCoords).toStrictEqual([[8,3],[1,3],[5,5]])
})


// maybe make another test, testing trying to attack twice, and then only storing one instance of coordinate
test('test only one instance of a coordinate is in guessedCoords', () => {
    newGameboard.receiveAttack(8,3)
    newGameboard.receiveAttack(8,3)
    expect(newGameboard.guessedCoords).toStrictEqual([[8,3]])
})

// report that all ships are sunk
// remember that first arg is column number (along x axis)
// second arg is row number (along y axis)

// this does not test for the Ship sunk property, just if all ship positions are guessed
// so it ain't a good test
//btw how checkIsGameOver works is that it compares two arrays which contain coordinates, and sees if one array contains all elements in another
test('report all ships are sunk', () => {
    newGameboard.placeShip(4, 'horizontal', [0,0])
    newGameboard.placeShip(4, 'vertical', [5,5])

    newGameboard.receiveAttack(0,0)
    newGameboard.receiveAttack(1,0)
    newGameboard.receiveAttack(2,0)
    newGameboard.receiveAttack(3,0)

    newGameboard.receiveAttack(5,5)
    newGameboard.receiveAttack(5,6)
    newGameboard.receiveAttack(5,7)
    newGameboard.receiveAttack(5,8)

    //now, how should the message be reported?
    // should something be set as a property? like gameboard.isOver
    newGameboard.checkIsGameOver()

    expect(newGameboard.isGameOver).toBe(true)
})

test('test that ship is sunk by hitting on all positions', () => {
    newGameboard.placeShip(4, 'horizontal', [0,0])
    newGameboard.receiveAttack(0,0)
    expect(newGameboard.getShip(0,0).hits).toBe(1)
    newGameboard.receiveAttack(1,0)
    expect(newGameboard.getShip(1,0).hits).toBe(2)
    newGameboard.receiveAttack(2,0)
    expect(newGameboard.getShip(2,0).hits).toBe(3)
    newGameboard.receiveAttack(3,0)

    expect(newGameboard.getShip(3,0).hits).toBe(4)
    expect(newGameboard.getShip(3,0).sunk).toBe(true)
})