let login = function (req, res, next) {
    let user = req.body.user;
    let passwd = req.body.passwd;

    req.login = true;

    next();  
};