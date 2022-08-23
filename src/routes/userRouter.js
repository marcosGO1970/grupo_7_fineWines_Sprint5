//-----Requires------//
const express = require('express');
const router= express.Router();
const guestMiddleware = require('../middleware/guestMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const userRegisterValidation = require('../middleware/userRegisterValidation');
// ************ Controller Require ************
const userController = require ('../controllers/userController.js')
const uploadPrep = require('../middleware/middlemulter')
const upload = uploadPrep('users','User')//Carpeta y entity

console.log('pase por el userRouter');

router.get('/login', guestMiddleware, userController.login);

router.post('/login', userController.loginProcess);

router.get('/register', userController.register);
//router.post('/', upload.array('image'), userController.store);
// array() para subir muchos archivos

router.post('/register', upload.single('fotoUsuario'),userRegisterValidation, userController.store);

router.get('/profile', authMiddleware, userController.profile);

router.get('/logout', userController.logout);

module.exports = router;