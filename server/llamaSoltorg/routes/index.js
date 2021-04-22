const { response } = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



/** Contains all active games */
let activeGames = []

// Handle POST-request to create game
router.post('/create-game', function(request, response) {
  console.log('POST /')
  console.dir(request.body)

  let username = request.body.credentials.username

  // Generate unique gameID
  let gameID
  do {
    gameID = Math.floor(Math.random() * 1000)
  } while (activeGames.some(game => game.gameID == gameID))

  let game = {
    "gameID" : gameID, 
    "gameState" : 0,  // Game has not started
    "players" : [
      {
        "username" : username,
        "points" : 0,
        "cards" : [],
        "turn": false,
      }
    ]
  }

  activeGames.push(game)

  response.send(convertGameToResponse(game, username))
})

// Handle POST-request to join game
router.post('/join-game', function(request, response) {
  console.log('POST /')
  console.dir(request.body)

  let username = request.body.credentials.username
  let gameID = request.body.gameID

  // Find game with matching gameID
  let game = activeGames.find(game => game.gameID == gameID)
  if (game == undefined) {
    response.send("game not found")
  } else if (game.gameState != 0) {
    response.send("game already started")
  } else if (game.players.some(player => player.username == username)) {
    response.send("you are already in this game")
  } 
  else {
    // Add new player and return game object to client
    game.players.push({
      "username" : username,
      "points" : 0,
      "cards" : [],
      "turn": false,
    })
    response.send(convertGameToResponse(game, username))
  }
})


// Handle POST-request to start an already created game
router.post('/start-game', function(request, response) {
  console.log('POST /')
  console.dir(request.body)

  let username = request.body.credentials.username
  let gameID = request.body.gameID
  let game = activeGames.find(game => game.gameID == gameID)

  if (game == undefined) {
    response.send("game not found")
  } else if (game.gameState != 0) {
    response.send("game already started")
  } else if (!game.players.some(player => player.username == username)) {
    response.send("you are not in this game")
  }
  else if (game.players.length < 2) {
    response.send("not enough players")
  }
   else {
    game.gameState = 1;
    game.events = [[{ // Double index because on is for round and one is for event
      "player" : "", // Empty string, meaning that the server did something and not a player
      "action" : 1  // Round started (the 1 would mean something different if it was a player)
    }]]

    response.send(convertGameToResponse(game, username))
  }
})

// Handle POST-request to get an active game
router.post('/get-game', function(request, response) {
  console.log('POST /')
  console.dir(request.body)

  
  let username = request.body.credentials.username
  let gameID = request.body.gameID
  let game = activeGames.find(game => game.gameID == gameID)

  response.send(convertGameToResponse(game, username))

})

/** Converts a locally stored game instance into a response to be sent to a player 
 * This is so that not all players can see all other players cards and such
*/
function convertGameToResponse(game, username) {
  let responseGame = {
    "gameID" : game.gameID,
    "gameState" : game.gameState,
    "players" : [],
    "events" : game.events,
    "myCards" : [],
    "myTurn" : false
  }

  game.players.forEach(function(player) {
    responseGame.players.push({
      "username" : player.username,
      "points" : player.points, 
    })
    // Only send the player's own "secret" info
    if (player.username == username) {
      responseGame.myCards = player.cards
      responseGame.myTurn = player.turn
    }
  })

  return responseGame;
}



module.exports = router;
