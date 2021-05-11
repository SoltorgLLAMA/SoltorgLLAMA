import requests
import json
from serverRequests import availableGames

def gameToJoin(username, password, url):
    games = availableGames(username, password, url)
    print("Available games (0 to create game)")
    for game in games:
        print("gameID: " , game["gameID"])
        print("Players: " , game["players"] , "/ 6")
        print("---------------------------")
    print("")
    print("gameID: ")
    gameIDResp = input()
    return gameIDResp