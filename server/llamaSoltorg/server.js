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
let deck = [];

/* Funktionen som körs när en match drar igång */

game();

function game() {
    activeGame = true;

    deck = [1, 1, 1, 1, 1, 1, 1, 1, //Sorterad llamakortlek. 7 = llama.
            2, 2, 2, 2, 2, 2, 2, 2, 
            3, 3, 3, 3, 3, 3, 3, 3, 
            4, 4, 4, 4, 4, 4, 4, 4, 
            5, 5, 5, 5, 5, 5, 5, 5, 
            6, 6, 6, 6, 6, 6, 6, 6,
            7, 7, 7, 7, 7, 7, 7, 7];

    deck = shuffle() //Kortleken blandas

    let runda = 0;

    while (true) {
        
        runda++;

        break;
    }

    function shuffle() { //Funktionen som blandar kortleken.
    let shuffledDeck = []; //Skapar en temporär array för kortleken.

    for (i = 0; i < 64; i++) {
        shuffledDeck.push(deck[Math.floor(Math.random() * deck.length)]); //Tar ett random kort från den sorterade högen och lägger den överst i den blandade högen.
    } 

    return shuffledDeck;
    }

    console.log(deck);
}

app.get('/ls', sendmarc);

function sendmarc(req, res) {
    res.send(userDocument);
}

app.get('/card', sendcard);

function sendcard(req, res) {
    res.send(deck[0])
}