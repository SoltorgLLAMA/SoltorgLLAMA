import json
import requests

def createGame(username, password, private, url):
    game = {
        'credentials': {
            'username': username,
            'password': password
        },
        'private': private
    }
    req = requests.post(url=url, json=game)
    return json.loads(req.text)


def availableGames(username, password, url):
    games = {
        'credentials': {
            'username': username,
            'password': password
        }
    }
    req = requests.post(url=url, json=games)
    return json.loads(req.text)


def getGame(username, password, gameID, url):
    gameInfo = {
        'credentials': {
            'username': username,
            'password': password
        },
        'gameID': gameID
    }
    req = requests.post(url=url, json=gameInfo)
    return json.loads(req.text)


def action(username, password, gameID, action, url):
    myAction = {
        'credentials': {
            'username': username,
            'password': password
        },
        'gameID': gameID,
        'action': action
    }
    req = requests.post(url=url, json=myAction)
    return json.loads(req.text)

