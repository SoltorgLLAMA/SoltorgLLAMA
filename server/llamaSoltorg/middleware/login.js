let testArray = [
    { id: 1, user: 'jesper', passwd: 'hejhej' },
    { id: 2, user: 'person', passwd: 'hej' }
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

  let username = request.body.credentials.username;
  let password = request.body.credentials.password;

    const validUsername = !!testArray.find(user => {
        return user.username === username;
    });
    const validPassword = !!testArray.find(password => {
        return password.password === password;
    });

    if (validUsername && validPassword) {
        console.log('Login sucessful by user: ' + username);
        return next();
    }

    res.redirect('/');
    console.log('Failed login');
}
