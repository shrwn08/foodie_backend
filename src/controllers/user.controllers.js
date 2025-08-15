import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password)
      res.status(400).json({ message: "All fields required" });

    //hashing password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUsername = username.toLowerCase();
    const newEmail = email.toLowerCase();
    const createdUser = await userModel.create({
      name,
      username: newUsername,
      email: newEmail,
      password: hashPassword,
    });

    const accessToken = jwt.sign(

      {id: createdUser._id, username: createdUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );


    const refreshToken = jwt.sign({id: createdUser._id, username : createdUser.username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn : process.env.REFRESH_TOKEN_EXPIRY})




    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.status(201).json({
      user: createdUser,
      accessToken,
      refreshToken, // Send refreshToken in response
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;



      if (!username || !password)
        res.status(400).json({ message: "all field are required" });

      const user = await userModel.findOne({ username });


      if (!user)
        return res.status(400).json({ message: "invalid credential " });
      
      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res
          .status(400)
          .json({ message: "username or password invalid" });

      const accessToken = jwt.sign({id: user._id, username : user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      });


      const refreshToken = jwt.sign(
        {id: user._id, username : user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      return res
        .json({ message: "User logged in successfully",accessToken, refreshToken ,user });
    
  } catch (error) {
    res.status(500).json({message: "Internal server error" , error : error.message});
  }
};

export const userAddress = async (req, res) => {
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
    console.log(req.body);
    if (!address || typeof address !== "string") {
      return res.status(400).json({ message: "Invalid address format" });
    }

    console.log("token :", token, "\n", "address :", address);

    const updatedUser = await userModel.findOneAndUpdate(
      { username: username },
      { $set: { address: address } },
      { new: true, runValidators: true } // Return updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Updated User:", updatedUser);
    res
      .status(200)
      .json({ message: "Address updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userWallet = async (req, res) => {
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

export const userLogout = async (req, res) => {
  const { username } = req.body;
  if (username === "admin") {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Admin logged out successfully" });
  }
  const user = await userModel.findOne({ username });
  if (user) {
    user.refreshToken = "";
    await user.save();
  }
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "User logged out successfully" });
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(403).json({ message: "Refresh token is required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.username === "admin") {
      const newAccessToken = jwt.sign(
        { username: "admin", role: "admin" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
      return res.status(200).json({ accessToken: newAccessToken });
    }

    const user = await userModel.findOne({ username: decoded.username });
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


