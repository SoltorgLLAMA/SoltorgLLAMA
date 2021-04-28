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
function login(req, res, next) {
    const validUsername = !!testArray.find(user => {
        return user.user === req.body.user
    });
    const validPasswd = !!testArray.find(passwd => {
        return passwd.passwd === req.body.passwd
    });

    if (validUsername && validPasswd) {
        console.log('Sucessful login');
        return next();
    }

    res.redirect('/');
    console.log('Failed login');
}