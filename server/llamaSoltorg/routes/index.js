const { response } = require("express");
var express = require("express");
var router = express.Router();
var gameFunctions = require('./gameFunctions');
let login = require('../middleware/login');

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});



let activeGames = []

// Handle POST-request to create game
router.post("/create-game", login.login, function(request, response) {
    console.log("POST /");
    console.dir(request.body);

    let username = request.body.credentials.username;

    // Generate unique gameID
    let gameID
    do {
        gameID = Math.floor(Math.random() * 1000);
    } while (activeGames.some((game) => game.gameID == gameID))

    // Set gameID to 1 if possible for easy debugging
    if (!activeGames.some((game) => game.gameID == gameID)) {
        gameID = 1
    }

    let game = gameFunctions.createGame(gameID)
    gameFunctions.addPlayer(game, username)

    activeGames.push(game);

    response.send({
        gameID: gameID,
    });
});

// Handle POST-request to join game
router.post("/join-game", function(request, response) {
    console.log("POST /");
    console.dir(request.body);

    let username = request.body.credentials.username;
    let gameID = request.body.gameID;

    // Find game with matching gameID
    let game = activeGames.find((game) => game.gameID == gameID);

    // Error handling
    if (game == undefined) {
        response.status(400).send("Game not found. gameID: " + gameID);
    } else if (game.gameState != 0) {
        response.status(400).send("Game already started. gameID: " + gameID);
    } else if (game.players.some((player) => player.username == username)) {
        response.status(400).send("Already joined this game. gameID: " + gameID);
    } else {
        gameFunctions.addPlayer(game, username)
        response.end();
    }
});

// Handle POST-request to start an already created game
router.post("/start-game", function (request, response) {
  console.log("POST /");
  console.dir(request.body);

  let username = request.body.credentials.username;
  let gameID = request.body.gameID;
  let game = activeGames.find((game) => game.gameID == gameID);

  // Error handling
  if (game == undefined) {
    response.status(400).send("Game not found. gameID: " + gameID);
  } else if (game.gameState != 0) {
    response.status(400).send("Game already started. gameID: " + gameID);
  } else if (!game.players.some((player) => player.username == username)) {
    response
      .status(400)
      .send(
        "You are not in this game. gameID: " + gameID + " username: " + username
      );
  } else if (game.players.length < 2) {
    response
      .status(400)
      .send(
        "Not enough players. gameID: " +
          gameID +
          " players: " +
          game.players.length
      );
  } else {
    
    gameFunctions.startRound(game)

    response.end()
  }
});

// Handle POST-request to get an active game
router.post("/get-game", function(request, response) {
    console.log("POST /");
    console.dir(request.body);

    let username = request.body.credentials.username;
    let gameID = request.body.gameID;
    let game = activeGames.find((game) => game.gameID == gameID);

    // Error handling
    if (game == undefined) {
        response.status(400).send("Game not found. gameID: " + gameID);
    } else if (!game.players.some((player) => player.username == username)) {
        response.status(400).send("You are not in this game. gameID: " + gameID + " username: " + username);
    } else {
        response.send(gameFunctions.convertGameToResponse(game, username));
    }


});

// Handle POST-request to get the internal model of a game
// ONLY FOR DEBUGGING
router.post('/get-game-raw', function(request, response) {
    console.log('POST /')
    console.dir(request.body)

    let gameID = request.body.gameID
    let game = activeGames.find(game => game.gameID == gameID)

    response.send(game)

})

// Handle POST-request to play an action in an active game
router.post('/action', function(request, response) {
    console.log('POST /')
    console.dir(request.body)


    let username = request.body.credentials.username
    let action = request.body.action
    let gameID = request.body.gameID
    let game = activeGames.find(game => game.gameID == gameID)

    // Check if game is valid
    if (game == undefined) {
        response.status(400).send("Game not found. gameID: " + gameID);
    } else if (game.gameState == 0) {
        response.status(400).send("Game not started. gameID: " + gameID);
    } else if (!game.players.some(player => player.username == username)) {
        response.status(400).send("You are not in this game. gameID: " + gameID + " username: " + username);
    } else {
        // Is it your turn?
        let player = game.players.find(player => player.username == username)
        if (!player.isTheirTurn) {
            response.status(400).send("It is not your turn.");
        }

        // Handle action
        else if (action == undefined) {
            response.status(400).send("Bruh. You need to send an action!");
        } else if (action == 0) {
            // Draw card
            let drawnCard
            try {
                drawnCard = gameFunctions.drawCard(game, username)
                response.send({ "drawnCard": drawnCard })
            } catch (error) {
                response.status(400).send(error);
            }
        } else if (action >= 1 && action <= 7) {
            // Play card
            try {
                gameFunctions.playCard(game, username, action)
                response.end()
            } catch (error) {
                response.status(400).send(error);
            }
        }
        else if (action == 8) {
          // Quit round
          gameFunctions.quitRound(game, username)
          response.end()
        }
    }
    
  }
)



module.exports = router;