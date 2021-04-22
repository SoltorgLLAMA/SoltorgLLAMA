var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




// Contains all active games
// TODO: Save this to file and load it on startup
let games = []

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
        "username" : username
      }
    ]
  }

  games.push(gameObject)

  response.send(gameObject)
})

// Handle POST-request to join game
router.post('/join-game', function(request, response) {
  console.log('POST /')
  console.dir(request.body)

  let username = request.body.credentials.username
  let gameID = request.body.gameID

  // Find game with matching gameID
  let game = games.find(game => game.gameID == gameID)
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
    })
    response.send(game)
  }
})






module.exports = router;
