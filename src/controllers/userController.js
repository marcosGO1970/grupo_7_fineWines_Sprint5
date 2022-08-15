const path = require('path')
const fs = require('fs');
const jsonDB = require('../model/jsonDatabase.js');
const userModel = jsonDB('users')
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');
//Objeto literal userController
//Viene de userRouter a cada modulo

const userController = {

    login: (req, res) => {
        res.render('users/login.ejs');
    },

	loginProcess: (req, res) => {
		console.log("llego al proceso de login")
		let userToLogin = userModel.findFirstByField("nombreUsuario", req.body.nombreUsuario)

		console.log(req.body.nombreUsuario)
		console.log(userToLogin)
// dos problemas: 1. no encuentra el user.

		if(userToLogin){
			console.log("llego al if con userToLogin = true")
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password)
			
			if(isOkThePassword){

				// borro la psw para que no quede en las cookies
				delete userToLogin.password;
				
				// en el request, en session genero una propiedad que se va a llamar 
				//userLogged con la informacion del usuario en sesion
				req.session.userLogged = userToLogin
				return res.render('users/profile.ejs', {user: req.session.userLogged})
			}}
			return res.render('users/login.ejs',{errors: 
													{credenciales: 
														{msg: 'Las credenciales son invalidas'}}})
	},

	logout: (req,res) => {
		req.session.destroy();
		return res.redirect('/')
	},

	profile: (req,res) => {
		res.render('users/profile.ejs', {user: req.session.userLogged})

	},

    register:(req, res) => {
        res.render('users/register.ejs');
    },
	// Create -  Method to store
	store: (req, res) => {
		
		//let imagen = req.file.filename
		const newUser = {
			id: 1, 
			...req.body,
			//piso el password del body con la psw hasheada. 
			//El objeto literal no puede tener dos passwords por eso la pisa
			password: bcryptjs.hashSync(req.body.password, 10),
			// Si no mando imágenes pongo na por defecto
			//image:req.files != undefined?imagenes:"default.jpg"
			image: req.file !== undefined ? req.file.filename : "default-image.png",
		};

		userModel.create(newUser)
		console.log('cree un nuevo usuario')
		res.redirect('/')
	},

}

module.exports = userController