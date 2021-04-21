var express = require('express');
const app = require('../app');
var router = express.Router();

let testArray = [
    { id: 1, user: 'jesper' },
    { id: 2, user: 'person' }
];

/*
    Check if username is taken or available
    when creating a user.
    TODO:
            connect to database or file
            cleanup log
            better redirect when user taken
*/
function isAvailable(req, res, next) {
    const usernameExists = !!testArray.find(user => {
        return user.user === req.body.user
    });

    console.log(usernameExists + "#####" + req.body.user);

    if (!usernameExists) {
        console.log("@@@@ NOT in array");
        return next();
    }
    res.redirect('/');
    console.log("!!! User in array");
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API' });
});


/*
    /api/createAccount
    Needs a username and password from client
    and checks if valid and not in use.
    Responds with outcome. 
*/
router.post('/createAccount', isAvailable,function(req, res){
    res.type('json');
    res.send('{"message":"Succ"}');
    // TODO: create account
});

module.exports = router;

