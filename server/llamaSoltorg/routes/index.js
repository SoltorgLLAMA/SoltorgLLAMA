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
  let gameID = Math.floor(Math.random() * 1000) // Random number (collisions can happen for now)   

  let gameObject = {
    "gameID" : gameID, 
    "gameState" : 0,  // Game has not started
    "players" : [
      {
        "username" : username,
        "points" : 0,
      }
    ]
  }

  activeGames.push(gameObject)

  response.send(gameObject)
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
    })
    response.send(game)
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
    game.rounds = [[{
      "player" : "", // Empty string, meaning that the server did something and not a player
      "action" : 1  // Round started (the 1 would mean something different if it was a player)
    }]]

    response.send(game)
  }
})





module.exports = router;
