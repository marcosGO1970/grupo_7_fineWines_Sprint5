
//middleware para detectar que un usuario que quiere entrar a login o 
//register esta loqueado y mandarlo a profile
function guestMiddleware(req, res, next){
    if(req.session.userLogged){
        return res.redirect('/user/profile')
    }
    next()
}

module.exports = guestMiddleware;

