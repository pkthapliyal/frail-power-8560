const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
var cookie = require('cookie');
const axios = require('axios')
const mongoose = require("mongoose")
const passport = require("passport")

const GitHubStrategy = require('passport-github2').Strategy;

require('dotenv').config()
const secretKey = process.env.secretKey;
const userRoute = express.Router();
const { UserModel } = require("../models/User.model")





userRoute.post("/register", async (req, res) => {
    const { name, email, age, password } = req.body;
    const isUser = await UserModel.findOne({ email: email })
    if (isUser) {
        return res.status(401).send({ "error": "user is already registered !" })
    }
    if (email && name && age && password) {
        try {
            bcrypt.hash(password, 5, async (err, hash) => {
                user = UserModel({ name, email, password: hash, age })
                await user.save()
                res.send({ "messege": "one user has been registered !" })
            })

        } catch (error) {
            return res.status(401).send({ "error": error.messege })
        }
    }
    else {
        res.status(401).send({ "error": "Please fill all details." })
    }
})


userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(401).send({ "err": "Wrong credentials !" })
        }
        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {

                const token = jwt.sign({ authorID: user._id, author: user.name, email: user.email }, secretKey, { expiresIn: "1h" });
                const refreshToken = jwt.sign({ authorID: user._id, author: user.name, email: user.email }, secretKey, { expiresIn: "7d" });

                res.cookie('token', token)
                res.cookie('refreshToken', refreshToken)
                return res.status(200).send({ "message": "login successfully" })
            }
            else if (err) {
                return res.status(401).send({ "err": err.messege })
            }
        })
    } catch (error) {
        return res.status(401).send({ "err": error.messege })
    }
})


//  user details 
// userRoute.get("/profile", async (req, res) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(404).send({ "error": "Invailed token" })
//     }
//     tokenValue = token.replace("Bearer ", "")
//     jwt.verify(tokenValue, "secret", async (err, decoded) => {
//         if (decoded) {
//             // req.body.authorID = decoded.userID;
//             // req.body.author = decoded.user
//             const user = await UserModel.findOne({ _id: decoded.authorID })
//             console.log(user)
//             return res.status(200).send(user)
//         }
//         else if (err) {
//             return res.status(404).send({ "error": err.message })
//         }
//     })

// })

//  Refresh  Token  
// userRoute.post("/refresh", async (req, res) => {
//     //  here token will come from body
//     let { refreshTokenBody } = req.body
//     if (!refreshTokenBody) {
//         return res.status(401).send({ "err": "Unauthorized !" })
//     }

//     const decoded = jwt.verify(refreshToken, secretKey);
//     jwt.verify(refreshTokenBody, secretKey, async (err, decoded) => {
//         if (err) {
//             return res.send({ "error": err.message })
//         }
//         const user = await UserModel.findOne({ email: decoded.email })
//         const token = jwt.sign({ authorID: user._id, author: user.name, email: user.email }, secretKey, { expiresIn: "1h" });
//         const refreshToken = jwt.sign({ authorID: user._id, author: user.name, email: user.email }, secretKey, { expiresIn: "7d" });
//         if (!user) {
//             return res.status(401).send({ "err": "Unauthorized !" })
//         }
//         // token Again 
//         res.cookie('token', token)
//         res.cookie('refreshToken', refreshToken)
//         return res.send({ "messege": "login successfully" })
//     })
// })





module.exports = { userRoute }