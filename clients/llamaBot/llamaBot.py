import requests
import json
from serverRequests import *
from consoleIO import *

url = "http://localhost:3000/"
createAccountUrl = url + "create-account"
createGameUrl = url + "create-game"
joinGameUrl = url + "join-game"
startGameUrl = url + "start-game"
getGameUrl = url + "get-game"
availableGamesUrl = url + "available-games"
actionUrl = url + "action"

print(gameToJoin("jesper", "hej", availableGamesUrl))
