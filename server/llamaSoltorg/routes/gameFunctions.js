/**
 * Converts a locally stored game instance into a response tailor-made
 * for the player with the provided username.
 * This is so that players only receive necessary info.
 * @param {object} game 
 * @param {string} username 
 * @returns {object}
 */
function convertGameToResponse(game, username) {
  let responseGame = {
    "gameID": game.gameID,
    "players": [],
    "events": game.events,
    "cardsRemaining": game.drawPile.length,
    "myCards": [],
    "isMyTurn": false
  }

  game.players.forEach(function (player) {
    responseGame.players.push({
      "username": player.username,
      "points": player.points,
      "isTheirTurn": player.isTheirTurn,
      "hasQuitRound": player.hasQuitRound,
      "numOfCards": player.cards.length,
    })
    // Add this player's info to object root for easy access
    if (player.username == username) {
      responseGame.myCards = player.cards
      responseGame.isMyTurn = player.isTheirTurn
    }
  })

  return responseGame;
}


/**
 * Creates a game with empty values, with the provided gameID
 * @param {object} gameID 
 * @param {bool} private whether the game should be discoverable by everyone or not
 * @returns 
 */
function createGame(gameID, private) {
  return {
    "gameID": gameID,
    "gameState": 0,  // Game has not started
    "private": private,
    "drawPile": [],
    "discardPile": [],
    "events": [
      {
        "player": "",
        "action": 100,
      },
    ],
    "players": [],
  }
}

/**
 * Adds a player to a game and creates corresponding event
 * @param {object} game 
 * @param {string} username the new player's username
 */
function addPlayer(game, username) {
  game.players.push(
    {
      "username": username,
      "points": 0,
      "cards": [],
      "hasQuitRound": false,
      "isTheirTurn": false,
    }
  )
  game.events.push(
    {
      "player": username,
      "action": 100,
    }
  )
}

/**
 * Prepares the deck, deals cards and gives the turn to the first player
 * @param {object} game 
 * @param {string} startingPlayerUsername username of the player who should start the next round (optional)
 */
function startRound(game, startingPlayerUsername) {
  game.gameState++
  game.drawPile = getShuffledDeck()

  // Deal 6 cards to each player
  game.players.forEach(player => {
    // First reset turn and empty hand from previous round
    player.isTheirTurn = false; 
    player.hasQuitRound = false;
    player.cards = [] 

    // Draw cards
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

  advanceTurn(game, startingPlayerUsername)
}

/**
 * Ends the round and calls startRound() or
 * endGame() depending on if someone has won or not
 * @param {object} game 
 * @param {string} startingPlayerUsername username of the player who should start the next round (optional)
 */
function endRound(game, startingPlayerUsername) {
  game.events.push(
    {
      "player": "",
      "action": 8
    }
  )

  // Deal points to each player
  game.players.forEach(player => {

    player.isTheirTurn = false

    let gainedPoints = 0;

    // Check if player won round and should 
    // get to remove some points
    if (player.cards.length == 0) {
      if (player.points >= 10) {
        gainedPoints = -10
      } else if (player.points > 0) {
        gainedPoints = -1
      }
    } else {
      gainedPoints = countHandPoints(player.cards)
    }

    player.points += gainedPoints

    // Reveal hand through event
    game.events.push(
      {
        "player": player.username,
        "action": 9,
        "cards": player.cards,
        "gainedPoints": gainedPoints,
      }
    )
  })

  // Check if someone has lost
  if (game.players.some(player => player.points >= 40)) {
    // End game
    endGame(game)
  } else {
    // Start new round
    startRound(game, startingPlayerUsername)
  }
}

/**
 * Sets gameState to -1 and adds the final game-ended event
 * @param {object} game 
 */
function endGame(game) {
  gameState = -1;
  game.events.push(
    {
      "player": "",
      "action": 101
    }
  )
}

/**
 * Returns a shuffled version of the provided array
 * @param {array} array 
 * @returns {array}
 */
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

/**
 * Returns a full set of cards represented as integers
 * @returns {array}
 */
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

/**
 * Moves a card of the specified value from the player's hand to the discard pile
 * Throws error if player attempts to make an illegal move
 * @param {object} game 
 * @param {string} username 
 * @param {int} card 
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
  } else if (card > game.discardPile[game.discardPile.length - 1] + 1) {
    throw "Card value is too high"
  }

  // Play card and remove it from hand
  game.discardPile.push(card)
  player.cards.splice(player.cards.indexOf(card), 1)

  game.events.push({
    "player": username,
    "action": card,
  })

  // Check if player won the round 
  if (player.cards.length == 0) {
    endRound(game, player.username)
  } else {
    advanceTurn(game)
  }
}

/**
 * Moves the last card in drawPile to player's hand
 * Throws error drawPile is empty
 * @param {object} game 
 * @param {string} username 
 * @returns {int} the drawn card
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
      "player": username,
      "action": 0,
    })
    return newCard
  }
}

/** 
 * The player with the provided username is quits the current round
 * @param {object} game 
 * @param {string} username 
 */
function quitRound(game, username) {
  let player = game.players.find(player => player.username == username)
  player.hasQuitRound = true

  // Check if there are players left in the round
  if (game.players.some(player => player.hasQuitRound == false)) {
    advanceTurn(game,)
  } else {
    endRound(game, player.username)
  }
}

/**
 * Moves the turn to the next player
 * If it is no one's turn, meaning the game has not started,
 * it gives the turn to the player with the provided username.
 * If no username is provided, the first player gets the turn
 * @param {*} game 
 * @param {*} username (optional) the player to give the turn to
 * @returns 
 */
function advanceTurn(game, username) {
  let activePlayers = game.players.filter(player => player.hasQuitRound == false || player.isTheirTurn == true)

  // Ideally, this function should not be called if 
  // this is the case, but somehow it does...
  if (activePlayers.length == 0) {
    return
  }

  let turnIndex = activePlayers.findIndex(player => player.isTheirTurn == true)

  if (turnIndex == -1) {
    // No player has the turn

    let startingPlayer = activePlayers.find(player => player.username == username)
    if (startingPlayer == undefined) {
      // No valid starting player was provided - give the first player the turn
      activePlayers[0].isTheirTurn = true;
    } else {
      // Give the turn to the player with the provided username
      startingPlayer.isTheirTurn = true;
    }
    
  } else if (turnIndex == activePlayers.length - 1) {
    // The last player has the turn - give it to the first player
    activePlayers[turnIndex].isTheirTurn = false;
    activePlayers[0].isTheirTurn = true;
  } else {
    // A player has the turn - give it to the next player
    activePlayers[turnIndex].isTheirTurn = false;
    activePlayers[turnIndex + 1].isTheirTurn = true;
  }
}

/**
 * Calculates the number of points the provided hand is worth
 * @param {array} array 
 * @returns {int} points
 */
function countHandPoints(array) {
  let points = 0;
  for (let i = 1; i < 8; i++) {
    if (array.includes(i)) {
      if (i == 7) {
        points += 10
      } else {
        points += i;
      }
    }
  }
  return points;
}


module.exports = {
  "convertGameToResponse": convertGameToResponse,
  "createGame": createGame,
  "addPlayer": addPlayer,
  "startRound": startRound,
  "countHandPoints": countHandPoints,
  "shuffle": shuffle,
  "getShuffledDeck": getShuffledDeck,
  "playCard": playCard,
  "drawCard": drawCard,
  "quitRound": quitRound,
  "advanceTurn": advanceTurn
}