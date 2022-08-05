const { body } = require("express-validator");

const path = require("path");

const productEditValidation = [
    body('name')
        .notEmpty().withMessage("No puede estar el campo vacio").bail()
        .isLength({ min: 4 }).withMessage('Debes escribir un nombre de producto con más de 4 caracteres'),
   
	body('price')
        .notEmpty().withMessage("No puede estar el campo vacio"),
        
	body("category")
        .notEmpty().withMessage("Debe seleccionar una categoría"),

	body('description')
        .notEmpty().withMessage('Debe escribir una descripción').bail()
	    .isLength({ min: 4 }).withMessage('Debe escribir como mínimo 4 letras o caracteres'),

	body("image")
        .custom((value, {req}) => {
            // const files = req.files; // La linea de abajo hace lo mismo
            const { files } = req;
	
            if( files.length > 0){
                const extensionesValidas = [".png", ".jpg", ".jpeg"];
    
                files.forEach( file => {
                    const fileExtension = path.extname(file.originalname)
                    if(!extensionesValidas.includes(fileExtension)){
                        throw new Error(`Los formatos de imagen validos son ${extensionesValidas.join(', ')}`);
                    }
                })               
            }                
            
            return true; 
        }),	
]

module.exports = productEditValidation;