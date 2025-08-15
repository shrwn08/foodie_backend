import express from 'express';
import multer from 'multer';
import {uploadProduct, getProducts} from '../controllers/product.controllers.js';
import { CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

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


export default router