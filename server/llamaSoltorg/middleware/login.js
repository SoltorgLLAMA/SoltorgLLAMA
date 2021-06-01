const fs = require("fs");
const bcrypt = require('bcrypt');
var bodyParser = require("body-parser");
const { json } = require("body-parser");
var users = require('./users.json');
const saltRounds = 10;

/*
    Middleware for login
    Checking username and password against db/file
    TODO:
            better redirect to show why fail
*/

/** Creates account and adds to file users.json */
function createAccount(request, response, next) {
    let InputUsername = request.body.credentials.username;
    let InputPassword = request.body.credentials.password;

    let usernameTaken = !!users.find(user => {
        return user.username === InputUsername;
    })
    console.log(usernameTaken);

    if (!usernameTaken) {

        let hash = bcrypt.hashSync(InputPassword, 10);

        let newUser = {
            username: InputUsername,
            password: hash
        };
        users.push(newUser);
        let newStringUser = JSON.stringify(users, null, 2);
        fs.writeFileSync("./middleware/users.json", newStringUser);

        return next();
    }
    console.log("Username already taken, username: " + InputUsername);
    response.status(400).send("Username already taken, username: " + InputUsername);
}

/** Logins by checking against users.json */
function login(request, response, next) {

    let InputUsername = request.body.credentials.username;
    let InputPassword = request.body.credentials.password;
    let InputPasswordHash = bcrypt.hashSync(InputPassword, 10);

    console.log("Login middleware");

    let validUsername = !!users.find(user => {
        return user.username === InputUsername;
    });
    let validPassword = !!users.find(user => {
        return bcrypt.compareSync(InputPassword, user.password);
    });



    if (validUsername && validPassword) {
        console.log('Login by user: ' + InputUsername);
        return next();
    }

    console.log('Failed login');
    response.status(401).send("Login failed");
}

module.exports = {
    "login": login,
    "createAccount": createAccount
}