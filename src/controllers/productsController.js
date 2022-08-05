
const jsonDB = require('../model/jsonDatabase');
const productModel = jsonDB('products')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const { validationResult } = require("express-validator");

const controller = {


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
		// Acá se trata como un array de files
		let imagenes= []
// leo secuencialmente el array de fotos y las cargo en el array de imágenes
//  puede ser que venga una sóla foto
        for(let i = 0 ; i<req.files.length;i++){
            imagenes.push(req.files[i].filename)
        }
		
		console.log(req.files);
		
		// Atrapo todos los campos del formulario

		const newProduct = {
			...req.body, // spread operator, inyecta campos del body del formulario y sus campos al new product
			// Si no mando imágenes pongo na por defecto
			//image:req.files != undefined?imagenes:"default.jpg"
			image: req.files.length >= 1  ? imagenes : ["default-image.png"],
			
			visitado: false

		}

		productModel.create(newProduct)
		console.log('cree un nuevo producto')
		res.redirect('/')
	},


	// Update - Form to edit


	edit: (req, res) => {
		console.log('ESTOY USANDO EL EDIT DEL GENERICO')
		let productToEdit = productModel.find(req.params.id)
		console.log(productToEdit)
		res.render('product-edit-form', { productToEdit })
	},

	// Update - Method to update



	update: (req, res) => {
		let productToEdit = productModel.find(req.params.id)

		let imagenes = [];
		// leo secuencialmente el array de fotos y las cargo en el array de imágenes
		//  puede ser que venga una sóla foto
		for(let i = 0 ; i < req.files.length; i++){
			imagenes.push(req.files[i].filename)
		}
		productToEdit = {

			id: productToEdit.id,
			...req.body,
		// Si se suben imagenes se pone como valor el array imagenes y sino se queda el que ya estaba antes
			image: req.files.length >= 1  ? imagenes : productToEdit.image,
			visitado: productToEdit.visitado
		}
		console.log(productToEdit)
		productModel.update(productToEdit)
		res.redirect("/");

	},


    destroy: function(req,res){
        productModel.delete(req.params.id);
        res.redirect("/");
    }



};



module.exports = controller;