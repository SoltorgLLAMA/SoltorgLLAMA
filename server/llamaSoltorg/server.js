let fs = require('fs');
let express = require('express');

let data = fs.readFileSync('users.json');
let userDocument = JSON.parse(data) //Läser in alla använadre till minnet från users.json

let app = express();
let server = app.listen(3000, listening); //Startar servern på port 3000.

function listening() {
    console.log("listening. . . "); //Visar att servern fungerar.
}

let players = 0; //Antalet spelare som deltar i matchen.
let activeGame = false; //bool som berättar om en match pågår.
let deck = [1, 1, 1, 1, 1, 1, 1, 1, //Sorterad llamakortlek. 7 = llama.
            2, 2, 2, 2, 2, 2, 2, 2, 
            3, 3, 3, 3, 3, 3, 3, 3, 
            4, 4, 4, 4, 4, 4, 4, 4, 
            5, 5, 5, 5, 5, 5, 5, 5, 
            6, 6, 6, 6, 6, 6, 6, 6,
            7, 7, 7, 7, 7, 7, 7, 7];

/* Funktionen som körs när en match drar igång */

game();

function game() {
    activeGame = true;
    console.log(deck);
    deck = shuffle(deck) //Kortleken blandas

    let runda = 0;

    while (true) {
        
        runda++;

        break;
    }

    

    console.log(deck);
}

function shuffle(array) { //Blandar kortleken
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
  
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

app.get('/request/:user/:password', request);

function request(req, res) {
    let data = req.params;
    let specuser = data.user;
    let specpassword = data.password;
    
    
}

app.get('/card', sendcard);

function sendcard(req, res) {
    res.send(deck[0])
}