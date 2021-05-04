let testArray = [
    { id: 1, username: 'jesper', password: 'hejhej' },
    { id: 2, username: 'person', password: 'hej' }
];
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

    const usernameTaken = !!testArray.find(username => {
        return username.username === InputUsername;
    })

    if (!usernameTaken) {
        // Add account to db/users.js
    }
    response.status(400).send("Username already taken, username: " + InputUsername);
    response.redirect('/');
    console.log("Username already taken, username: " + InputUsername);
}

function login(request, response, next) {

    let InputUsername = request.body.credentials.username;
    let InputPassword = request.body.credentials.password;

    const validUsername = !!testArray.find(username => {
        return username.username === InputUsername;
    });
    const validPassword = !!testArray.find(password => {
        return password.password === InputPassword;
    });

    if (validUsername && validPassword) {
        console.log('Login by user: ' + username);
        return next();
    }

    response.status(401).send("Login failed");
    response.redirect('/');
    console.log('Failed login');
}

module.exports = {
    "login": login
}