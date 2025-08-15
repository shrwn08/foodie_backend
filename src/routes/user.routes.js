import express from 'express';
import userValidation from '../middlewares/userValidation.middleware.js';
import {userRegister, userLogin, userLogout,userAddress, refreshToken, userWallet} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/register", userValidation, userRegister)

router.post("/login", userLogin);

router.post("/refresh", refreshToken);

router.put("/address", userAddress);

router.put("/wallet", userWallet)

router.post("/logout", userLogout);

export default router

