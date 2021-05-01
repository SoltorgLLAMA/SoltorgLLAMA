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
        "isTheirTurn" : player.isTheirTurn,
      })
      // Only send the player's own "secret" info
      if (player.username == username) {
        responseGame.myCards = player.cards
        responseGame.isMyTurn = player.isTheirTurn
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

    game.events.push({
      "player" : username,
      "action" : card,
    })
    advanceTurn(game)
  }
}

/** Moves the last card in drawPile to player's hand
 * Throws error drawPile is empty
 */
 function drawCard(game, username) {
  if (game.drawPile.length == 0) {
    throw "Draw pile is empty"
  } else {
    let player = game.players.find(player => player.username == username)
    let newCard = game.drawPile.pop()
    player.cards.push(newCard)
    advanceTurn(game)
    game.events.push({
      "player" : username,
      "action" : 0,
    })
    return newCard
  }
}

/**Moves the turn to the next player
 * If it is no one's turn, meaning the game has not started,
 * it gives the turn to the first player in game.players
 */
function advanceTurn(game) {
  let turnIndex = game.players.findIndex(player => player.isTheirTurn == true)
  if (turnIndex == -1) {
    game.players[0].isTheirTurn = true;
  } else if (turnIndex == game.players.length - 1) {
    game.players[turnIndex].isTheirTurn = false;
    game.players[0].isTheirTurn = true;
  } else {
    game.players[turnIndex].isTheirTurn = false;
    game.players[turnIndex + 1].isTheirTurn = true;
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
    "drawCard" : drawCard,
 }