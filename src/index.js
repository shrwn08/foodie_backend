const express = require("express");
const dbConnection = require("./database/db");
const userRoutes = require('./routes/user.routes')
const productRoutes = require('./routes/product.routes')
const userModel = require("./models/user.model");
const bcrypt = require("bcrypt");
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();

app.use(
    cors({
        origin:["http://localhost:5173","https://foodie-frontend-mu.vercel.app/"],
        credentials: true,
        methods: "GET, POST, PUT, DELETE",
        allowedHeaders: "Content-Type, Authorization",
    })
);

app.options("*", (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus((200))
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection();
  

app.use("/auth/user", userRoutes);
app.use("/auth", productRoutes);

app.listen(port, console.log(`server started on port ${port}`));
