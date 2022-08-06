const path = require('path')
const fs = require('fs');
const jsonDB = require('../model/jsonDatabase.js');
const userModel = jsonDB('users')
const { validationResult } = require("express-validator");

//Objeto literal userController
//Viene de userRouter a cada modulo

const userController = {

    login: (req, res) => {
        res.render('users/login.ejs');
    },

    register:(req, res) => {
        res.render('users/register.ejs');
    },
   
	detail: (req, res) => {
		const product = productModel.find(req.params.id)
		console.log("------------ESTOY EN DETAIL----------------------")
		console.log(product)
		console.log(product.image[0])
		// COn este veo las otras fotos por eso el índice empieza en UNO Esto NO SIRVE !!!
		console.log("VEO LAS SIGUIENTES FOTOS")
		for( let i = 1; i < (product.image).length; i++ ) { 
			console.log(product.image[i] )
		
		}
		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
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


	// Update - Form to edit


	edit: (req, res) => {
		console.log('ESTOY USANDO EL EDIT DEL GENERICO')
		let productToEdit = productModel.find(req.params.id)
		console.log(productToEdit.image)
		res.render('product-edit-form', { productToEdit })
	},

	// Update - Method to update



	update: (req, res) => {
		let productToEdit = productModel.find(req.params.id)

		productToEdit = {

			id: productToEdit.id,
			...req.body,
		//	image: productToEdit.image,

		}

		productModel.update(productToEdit)
		res.redirect("/");

	},


    destroy: function(req,res){
        productModel.delete(req.params.id);
        res.redirect("/");
    }

}

module.exports = userController