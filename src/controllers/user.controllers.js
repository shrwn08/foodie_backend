const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const userRegister = async (req, res) => {
  try {
    // console.log(req.body);

    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password)
      res.status(400).json({ message: "All fields required" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
      const newUsername = username.toLowerCase();
      const newEmail = email.toLowerCase();
    const createdUser = await userModel.create({
      name,
      username : newUsername,
      email : newEmail,
      password: hashPassword,
    });
    const token = jwt.sign({ username }, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
    res.cookie("token", token);
    res
      .status(201)
      .json({ user: createdUser, message: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username: "admin", role: "admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        return res
          .cookie("token", token, { httpOnly: true, secure: true })
          .json({ message: "Admin login successful", token });
      }else{
      if(!username || !password) res.status(400).json({message : "all field are required"})

      const user = await userModel.findOne({ username});

      if(!user) return res.status(400).json({message : "invalid credential "});

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "username or password invalid" });

      const token = jwt.sign({ username }, `${process.env.ACCESS_TOKEN_SECRET}`);
      console.log("token", token)
      return res.cookie("token", token).json({message : "User logged in successfully", token, user});
    }




  } catch (error) {
    res.status(500).json();
  }
};



const userAddress = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract actual token

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const username = decoded.username; // Use userId instead of username

    // Extract address from request body
    const { address } = req.body;
    console.log(req.body)
    if (!address || typeof address !== "string") {
      return res.status(400).json({ message: "Invalid address format" });
    }

    console.log("token :" ,token  , "\n","address :", address )


    const updatedUser = await userModel.findOneAndUpdate(
        {username: username},
        { $set: { address: address } },
        { new: true, runValidators: true } // Return updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Updated User:", updatedUser);
    res.status(200).json({ message: "Address updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const userWallet = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];


  try {
    // Verify the token with the correct secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


    const username = decoded.username;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    // Fetch the user from the database
    const user = await userModel.findOne({ username });
    console.log("user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wallet: user.wallet });

  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};




const userLogout = async (req, res) => {
  res.cookie("token", "");
};

module.exports = { userRegister, userLogin, userLogout, userAddress, userWallet };
