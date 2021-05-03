/** Converts a locally stored game instance into a response to be sent to a player 
 * This is so that players only receive necessary info
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
      // Add this player's info to object root for easy access
      if (player.username == username) {
        responseGame.myCards = player.cards
        responseGame.isMyTurn = player.isTheirTurn
      }
    })
  
    return responseGame;
  }

/** Creates a game with empty values, with the provided gameID */
function createGame(gameID) {
  return {
    "gameID" : gameID, 
    "gameState" : 0,  // Game has not started
    "drawPile" : [],
    "discardPile" : [], 
    "events" : [
      {
      "player" : "",
      "action" : 0, 
      },
    ],
    "players": [],
  }
}

/** Adds a player to a game and creates corresponding event */
function addPlayer(game, username) {
  game.players.push(
    {
      "username": username,
      "points": 0,
      "cards": [],
      "isTheirTurn": false,
    }
  )
  game.events.push(
    {
      "player" : username,
      "action" : 100,
    }
  )
}

/** Prepares the deck, deals cards and gives the turn to the first player */
function startGame(game) {
  game.gameState = 1;
  game.drawPile = getShuffledDeck()

  // Deal 6 cards to each player
  game.players.forEach(player => {
    for (let index = 0; index < 6; index++) {
      player.cards.push(game.drawPile.pop())
    }
  });

  let startCard = game.drawPile.pop()
  game.discardPile.push(startCard)
  game.events.push(
    {
      "player": "", // Empty string, meaning that the server did something and not a player
      "action": startCard, 
    }
  )

  advanceTurn(game)
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
  } 
  if (card < game.discardPile[game.discardPile.length - 1]) {
    // Allow a 1 to be played on a llama
    if (!(card == 1 && game.discardPile[game.discardPile.length - 1] == 7)) {
      throw "Card value is too low."
    }
  } 

  // Play card and remove it from hand
  game.discardPile.push(card)
  player.cards.splice(player.cards.indexOf(card), 1)

  game.events.push({
    "player" : username,
    "action" : card,
  })
  advanceTurn(game)
  
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
    "createGame" : createGame,
    "addPlayer" : addPlayer,
    "startGame" : startGame,
    "countHandPoints": countHandPoints,
    "shuffle": shuffle,
    "getShuffledDeck" : getShuffledDeck,
    "playCard" : playCard,
    "drawCard" : drawCard,
    "advanceTurn" : advanceTurn
 }