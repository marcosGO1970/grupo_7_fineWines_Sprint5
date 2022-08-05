const path = require('path')
const fs = require('fs');
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

        // const files = req.files;
        const { files } = req;
        
        // Esto es más que nada informativo para nosotros no es indispensable
        console.log("-----LLEGO/ARON ESTA/S FOTO/S --------")
        files.forEach( file => {
            console.log(file.filename);
        })        
        
        // request
        // console.log('Esto tiene el request');
        // console.log(req);

        // Comienzo a validar//Guardo los resultados de la validacion en una variable
        const resultadosValidaciones = validationResult(req);
        // console.log('Esto tiene el resultadosValidaciones');      
        // console.log(resultadosValidaciones);
       
        // Con este if preguntamos si hay errores de validación
        if (!resultadosValidaciones.isEmpty()){
            console.log("----- ojo HAY ERRORES -----------------")
            
            // Si hay errores borramos los archivos que cargó multer
            files.forEach( file => {
                const filePath = path.join(__dirname, `../../public/images/products/${file.filename}`);
                fs.unlinkSync(filePath);
            })
            
            console.log("-------- my body -------------------")
            console.log(req.body);  

            console.log("-------- resultadosValidaciones.mapped() -------------------")
            console.log(resultadosValidaciones.mapped());  


            return res.render('product-create-form', {
                errors: resultadosValidaciones.mapped(),
                // oldData son los datos recién cargados es decir el req.body
                oldData: req.body
            })
        }

        console.log("--Muy bien, no hay errores ---------------------------");

        // Creamos un array vacío para ir almacenado los nombres de los archivos
        let imagenes = [];

        //  Leo de manera secuencial  el array files del request y cargo los nombres en el array de imágenes
        //  puede ser que venga una sola foto
        files.forEach( imagen => {
            imagenes.push(imagen.filename);
        })

        // Atrapo todos los campos del formulario
        const newProduct = {
            ...req.body,
            // Si no mando imágenes pongo una por defecto
            image: req.files.length >= 1 ? imagenes : ["default-image.png"]
        }
        productModel.create(newProduct);
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