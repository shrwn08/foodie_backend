import mongoose from "mongoose";

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
    },


      wallet : {
        type: Number,
          default: 5000,
      },
      refreshToken : {
        type: String,
      }


  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default  User;
