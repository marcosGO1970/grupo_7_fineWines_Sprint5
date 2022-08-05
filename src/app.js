//Modulos: Express y Path
const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override');
//const session = require("express-session");
//const cookies = require("cookie-parser");
//Rutas: hay una a / que es el mainRouter.js
//y otra a /users que es al userRouter.js
const mainRouter = require('./routes/mainRouter.js')
const userRouter = require('./routes/userRouter.js')
const productsRouter = require('./routes/products.js'); // Rutas /products
//Configuracion de la app
//Carpetas publicas
app.use(express.static(path.join(__dirname, '../public')))
//Configuraciones template engine: EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride("_method"));//Para poder usar PUT y DELETE
app.use(express.urlencoded({ extended: false }));//Para formularios
app.use(express.json());

app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/products', productsRouter);


const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
