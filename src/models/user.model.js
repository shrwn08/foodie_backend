const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password : {
        type: String,
      required: true,
    },
      avatar : {
       type: String,
       default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      },
    address :{
        type: String,
      required: true,
    },


      wallet : {
        type: Number,
          default: 5000,
      }


  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
