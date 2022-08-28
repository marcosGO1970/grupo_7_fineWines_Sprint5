const jsonDB = require('../model/jsonDatabase.js');//reuiero el modelo
const userModel = jsonDB('users')//modelo con user

// Genero y actualizo la variable de aplicacion: UserLogged

function userLoggedMiddleware(req, res, next){
res.locals.isLogged = false;

let emailInCookie = req.cookies.userEmail;
let userFromCookie = userModel.findFirstByField("nombreUsuario", emailInCookie);
console.log(userFromCookie);

if (userFromCookie) {
    req.session.userLogged= userFromCookie;
}
if(req.session.userLogged){
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged;
}






next();
}

module.exports = userLoggedMiddleware;
