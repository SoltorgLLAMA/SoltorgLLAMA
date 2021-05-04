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