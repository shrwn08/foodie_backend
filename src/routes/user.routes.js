import express from 'express';
import userValidation from '../middlewares/userValidation.middleware.js';
import {userRegister, userLogin, userLogout,userAddress,  userWallet} from "../controllers/user.controllers.js";
import {verifyToken} from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", userValidation, userRegister)

router.post("/login", userLogin);

router.put("/address",verifyToken, userAddress);

router.put("/wallet",verifyToken, userWallet)

router.post("/logout",verifyToken, userLogout);

export default router

