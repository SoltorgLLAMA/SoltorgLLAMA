const fs = require("fs");
var bodyParser = require("body-parser");
const { json } = require("body-parser");
var users = require('./users.json');

/*
    Middleware for login
    Checking username and password against db/file
    TODO:
            connect to database/file
            better log
            better redirect to show why fail
*/

function createAccount(request, response, next) {
    let InputUsername = request.body.credentials.username;
    let InputPassword = request.body.credentials.password;

    let usernameTaken = !!users.find(user => {
        return user.username === InputUsername;
    })
    console.log(usernameTaken);

    if (!usernameTaken) {
        let newUser = {
            username: InputUsername,
            password: InputPassword
        };
        users.push(newUser);
        let newStringUser = JSON.stringify(users, null, 2);
        fs.writeFileSync("./middleware/users.json", newStringUser);

        return next();
    }
    response.status(400).send("Username already taken, username: " + InputUsername);
    console.log("Username already taken, username: " + InputUsername);
    response.redirect('/');
}

function login(request, response, next) {

    let InputUsername = request.body.credentials.username;
    let InputPassword = request.body.credentials.password;

    console.log("Login middleware");
    
    let validUsername = !!users.find(user => {
        return user.username === InputUsername;
    });
    let validPassword = !!users.find(user => {
        return user.password === InputPassword;
    });
    
    if (validUsername && validPassword) {
        console.log('Login by user: ' + InputUsername);
        return next();
    }

    response.status(401).send("Login failed");
    response.redirect('/');
    console.log('Failed login');
}

module.exports = {
    "login": login,
    "createAccount": createAccount
}