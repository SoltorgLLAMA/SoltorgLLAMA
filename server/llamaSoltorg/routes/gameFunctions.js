
function shuffle() {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function getShuffledDeck() {
    let deck = [1, 1, 1, 1, 1, 1, 1, 1,
                2, 2, 2, 2, 2, 2, 2, 2, 
                3, 3, 3, 3, 3, 3, 3, 3, 
                4, 4, 4, 4, 4, 4, 4, 4, 
                5, 5, 5, 5, 5, 5, 5, 5, 
                6, 6, 6, 6, 6, 6, 6, 6,
                7, 7, 7, 7, 7, 7, 7, 7];
    return shuffle(deck);
}

function countHandPoints(array) {
    let points; 
    for (let i = 1; i < 8; i++) {
        if (array.includes(i)) {
            points += i;
        }
    }
    return points;
}


module.exports = {
    "countHandPoints": countHandPoints,
    "shuffle": shuffle,
 }