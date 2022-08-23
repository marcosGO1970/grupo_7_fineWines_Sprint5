const { body } = require("express-validator");
const path = require('path');

const userRegisterValidation = [
    body("nombres")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 2 }).withMessage("El nombre debe contener al menos 2 caracteres"),
    
    body("apellidos")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 2 }).withMessage("El apellido debe contener al menos 2 caracteres"),
    
    body("nombreUsuario")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 2 }).withMessage("El nombreUsuario debe contener al menos 2 caracteres"),
    
    body("email")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isEmail().withMessage("El formato de correo no es válido"),

    body("password")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres").bail()
        .custom((value, { req }) => {

            if(value != req.body.rePassword){
                throw new Error('Las contraseñas no coinciden');
            }
            
            return true;
        }),

    body("rePassword")
        .notEmpty().withMessage("El campo no puede estar vacío").bail()
        .isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres"),

    body("fechaNacimiento")
        .notEmpty().withMessage("Debes ser mayor de 18"),

    body("fotoUsuario")
        .custom((value, { req }) => {

            const { file } = req;

            if(file){
                const extensionesValidas = [".png", ".jpg", ".jpeg"];
    
                const fileExtension = path.extname(file.originalname);
    
                if(!extensionesValidas.includes(fileExtension)){
                    throw new Error(`Los formatos de imagen validos son ${extensionesValidas.join(', ')}`);
                }
            }   
            
            return true; 
        })
    

]

module.exports = userRegisterValidation;