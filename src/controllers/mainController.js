// requerimos el modelo para consultar la base de datos json
const jsonDB = require('../model/jsonDatabase');
// indicamos cual de las bases de datos queremos
const productModel = jsonDB('products')
const { validationResult } = require("express-validator");

//const products = productModel.readFile()
//console.log(products);
//Objeto literal mainController
//Viene de mainRouter a cada modulo
const mainController = {
    index: (req,res) => {
        const products = productModel.readFile()
        res.render('index', {products});
    },
    productCart: (req,res) => {
        res.render('productCart');
    },
    login: (req, res) => {
        res.render('users/login.ejs');
    },
    register:(req, res) => {
        res.render('users/register.ejs');
    },
    productDetail: (req,res) => {
        const id = Number(req.params.id);
        const products = productModel.readFile()
        const product = products.find( product => product.id === id);

        res.render('productDetail', {product});
    }
}

module.exports = mainController