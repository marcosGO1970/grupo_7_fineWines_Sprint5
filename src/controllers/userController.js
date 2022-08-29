const path = require('path')
const fs = require('fs');
const jsonDB = require('../model/jsonDatabase.js');
const userModel = jsonDB('users')
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');
const cookies = require('cookie-parser');
//Objeto literal userController
//Viene de userRouter a cada modulo

const userController = {

    login: (req, res) => {
        res.render('users/login.ejs');
    },

	loginProcess: (req, res) => {
		console.log("llego al proceso de login")
		let userToLogin = userModel.findFirstByField("email", req.body.email)

		//console.log(req.body.nombreUsuario)
		console.log(userToLogin)
// dos problemas: 1. no encuentra el user.

		if(userToLogin){
			console.log("llego al if con userToLogin = true")
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password)
			
			if(isOkThePassword){
				// borro la psw para que no quede en las cookies
				delete userToLogin.password;
				// en el request, en session genero una propiedad que se va a llamar 
				//creo userLogged en session con la informacion del usuario
				req.session.userLogged = userToLogin
                //si recordarme esta selected mando cookie con email/nombreUsuario
                if(req.body.remember_user) {
					res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
				}
				return res.render('users/profile.ejs', {user: req.session.userLogged})
			}}
			return res.render('users/login.ejs',{errors: 
													{credenciales: 
														{msg: 'Las credenciales son invalidas'}}})
	},

	logout: (req,res) => {
        res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/')
	},

	profile: (req,res) => {
		res.render('users/profile.ejs', {
            user: req.session.userLogged
        })

	},

    register:(req, res) => {
        res.render('users/register.ejs');
    },
	processRegister: (req, res) => {

        const countries = ["Argentina", "Uruguay", "Paraguay", "Chile", "Bolivia", "Perú", "Brasil", "Ecuador", "Venezuela", "Colombia"]; 

        const { file } = req;

        const errores = validationResult(req);

        if(!errores.isEmpty()){
            if(file){
                const filePath = path.join(__dirname, `../../public/images/users/${file.filename}`);
                fs.unlinkSync(filePath);
            }

            console.log(req.body);

            delete req.body.password;   
            delete req.body.confirmPassword;

            console.log(req.body);

            return res.render("./users/register", {
                errors: errores.mapped(),
                oldData: req.body,
                
            })
        }
        
        const existeEmail = userModel.findFirstByField("email", req.body.email);

        if(existeEmail){
            if(file){
                const filePath = path.join(__dirname, `../../public/images/users/${file.filename}`);
                fs.unlinkSync(filePath);
            }

            const error = {
                email: {
                    msg: "Este email ya está registrado"
                }
            }

            return res.render("./users/register", {
                errors: error,
                oldData: req.body,
                
            })
        }

        delete req.body.confirmPassword;

        const newUsuario = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            image: file ? file.filename : "default-user.png"
        };

        // newUsuario.categoria.trim();
        userModel.create(newUsuario);

        return res.redirect("/user/login");
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