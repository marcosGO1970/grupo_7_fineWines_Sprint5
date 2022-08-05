//-----Requires------//
const express = require('express');
const router= express.Router();

// ************ Controller Require ************
const userController = require ('../controllers/userController.js')
const uploadPrep = require('../middleware/middlemulter')
const upload = uploadPrep('users','User')//Carpeta y entity

console.log('pase por el userRouter');

router.get('/login', userController.login);

router.get('/register', userController.register);

//router.post('/', upload.array('image'), userController.store);
// array() para subir muchos archivos
router.post('/', upload.single('fotoUsuario'), userController.store);

module.exports = router;