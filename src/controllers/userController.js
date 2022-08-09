const path = require('path')
const fs = require('fs');
const jsonDB = require('../model/jsonDatabase.js');
const users = jsonDB('users')
const { validationResult } = require("express-validator");

//Objeto literal userController
//Viene de userRouter a cada modulo

const userController = {

    login: (req, res) => {
        res.render('users/login.ejs');
    },

	loginProcess: (req, res) => {
		let userToLogin = users.findFirstByField('userName', req.body.nombreUsuario)

		if(userToLogin){
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password)
			if(isOkThePassword){
				// en el request, en session genero una propiedad que se va a llamar 
				//userLogged con la informacion del usuario en sesion
				req.session.userLogged = userToLogin
				return res.render('user/profile')
			}
			let errors = {credenciales: {msg: 'las credenciales son invalidas'}}
			return res.render('users/login.ejs',{errors})

		}
	},

	profile: (req,res) => {
		res.render('profile', {user: req.session.userLogged})

	},

    register:(req, res) => {
        res.render('users/register.ejs');
    },
	// Create -  Method to store
	store: (req, res) => {
		
		//let imagen = req.file.filename
		const newUser = {
			...req.body,
			// Si no mando imágenes pongo na por defecto
			//image:req.files != undefined?imagenes:"default.jpg"
			image: req.file !== undefined ? req.file.filename : "default-image.png"
		};

		userModel.create(newUser)
		console.log('cree un nuevo usuario')
		res.redirect('/')
	},

}

module.exports = userController