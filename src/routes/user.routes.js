const express = require('express')
const userValidation = require('../middlewares/userValidation.middleware');
const {userRegister, userLogin, userLogout, userAddress, userWallet} = require("../controllers/user.controllers")

const router = express.Router();

router.post("/register", userValidation, userRegister)

router.post("/login", userLogin);

router.put("/address", userAddress);

router.put("/wallet", userWallet)

router.post("/logout", userLogout);

module.exports = router

