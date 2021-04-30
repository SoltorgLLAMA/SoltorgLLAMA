/** Converts a locally stored game instance into a response to be sent to a player 
 * This is so that not all players can see all other players cards and such
*/
function convertGameToResponse(game, username) {
    let responseGame = {
      "gameID" : game.gameID,
      "players" : [],
      "events" : game.events,
      "cardsRemaining" : game.drawPile.length,
      "myCards" : [],
      "isMyTurn" : false
    }
  
    game.players.forEach(function(player) {
      responseGame.players.push({
        "username" : player.username,
        "points" : player.points, 
        "isTheirTurn" : false,
      })
      // Only send the player's own "secret" info
      if (player.username == username) {
        responseGame.myCards = player.cards
        responseGame.myTurn = player.turn
      }
    })
  
    return responseGame;
  }
  


function shuffle(array) {
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

/** Moves the specified card from the player's hand to the discard pile
 * Throws error if player attempts to make an illegal move
 */
function playCard(game, username, card) {
  let player = game.players.find(player => player.username == username)

  if (!player.cards.some(ownedCard => ownedCard == card)) {
    throw "You do not have that card."
  } else if (card < game.discardPile[game.discardPile.length - 1]) {
    throw "Card value is too low."
  } else {
    // Play card and remove it from hand
    game.discardPile.push(card)
    player.cards.splice(player.cards.indexOf(card))
  }
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
    "convertGameToResponse" : convertGameToResponse,
    "countHandPoints": countHandPoints,
    "shuffle": shuffle,
    "getShuffledDeck" : getShuffledDeck,
    "playCard" : playCard,
 }