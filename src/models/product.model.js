import mongoose from  "mongoose";


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


export default mongoose.model("product", productSchema);
