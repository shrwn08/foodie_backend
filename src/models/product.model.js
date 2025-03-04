const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
    dish_name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    rating : {
        type : String,
        required : true
    },
    avatar:{
      type : String,
      required : true
    }
},{timestamps : true})


module.exports = mongoose.model("product", productSchema);
