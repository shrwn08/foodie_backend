const express = require('express')
const multer = require('multer')
const {uploadProduct, getProducts} = require('../controllers/product.controllers')
const { CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary')

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "products",
        allowed_formats : ['jpg', 'png', 'jpeg'],
        transformation : [{
            width : 500,
            height : 500,
            crop : "limit"
        }]
    }
})


const upload = multer({storage})



router.post("/upload-product", upload.single('avatar'), uploadProduct);
router.get('/products', getProducts);


module.exports = router