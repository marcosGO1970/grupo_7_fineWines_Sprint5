const multer = require('multer');
const path = require('path')

//Uso una funcion con Multer para poder pasarle la carpeta y el nombre del archivo segun lo que este usando
function upload (folderName, entity) {

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,'../../public/images/'+folderName));
    },
    filename : function(req,file,cb){
        cb(null, `${entity}-img-${Date.now()}hola${path.extname(file.originalname)}`)
    }
});

return multer({storage});//Devuelvo Multer resuelto en la variable upload

}

module.exports = upload;//exporto la variable con Multer adentro