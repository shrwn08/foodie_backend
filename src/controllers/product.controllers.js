import productModel from "../models/product.model.js";

import cloudinary from "cloudinary";

export const uploadProduct = async (req, res) => {


  try {
    if (!req.body)
      return res
        .status(400)
        .json({ message: "input fields are empty ", error: error.message });
    if (!req.file)
      return res
        .status(400)
        .json({ message: "file is not uploaded ", error: error.message });
    const { dish_name, description, category, price, rating } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    const newProduct = new productModel({
      dish_name,
      description,
      category,
      price: parseInt(price),
      rating,
      avatar: result.secure_url,
    });
    await newProduct.save();
    res.status(201).json({
      message: "Product uploaded",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getProducts = async (req, res) => {

   const {category} = req.query;
   
   if(category){
        let categories = category[0].toUpperCase() + category.substring(1,category.length);
       
        let filter = {};
        
        filter.category = categories
        const products = await productModel.find(filter);
        console.log(products)

        res.status(200).json({ message: "Products fetched successfully", products });
   }else{
    const products = await productModel.find();
    res.status(200).json({ message: "all products fetched", products });
   }

 
};

