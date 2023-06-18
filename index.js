const express = require("express");
const app = express()
const http = require('http');
const socketIO = require('socket.io');
const PORT = 8080
const WebSocket = require('ws');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const server = http.createServer(app);
const io = socketIO(server);
;
var session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient({ host: "localhost", port: 6397, password: "" })
const passport = require("passport");
const cors = require('cors')
const GitHubStrategy = require('passport-github2').Strategy;
const { v4: uuidv4 } = require('uuid');
var cookieParser = require('cookie-parser')
require('dotenv').config();
const { mailer } = require('./mailer')

const secretKey = process.env.secretKey
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

redisClient.connect()


const { UserModel } = require("./models/User.model")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require("axios")

//  import the whole auth.js file  for 
require("./auth")

function isLOggedIn(req, res, next) {
    if (req.user) {
        next()
    }
    else {
        res.sendStatus(401)
    }
}

app.get("/auth/google",
    passport.authenticate('google', { scope: ["email", 'profile'] })
)

app.get("/auth/google/callback",
    passport.authenticate("google", {
        // successRedirect: "/dashboard",
        failureRedirect: "/auth/failure",
        // session: false
    }),
    async function (req, res) {
        const { email, name, googleAccessToken } = req.user
        isUser = await UserModel.findOne({ email })
        const OTP = Math.floor(Math.random() * 99999) + 100000


        if (isUser) {
            await redisClient.setEx(email, 120, JSON.stringify(OTP))
            let result = await redisClient.get(email)
            mailer(OTP, email)
            const accessToken = jwt.sign({ email, userID: isUser._id }, secretKey, { expiresIn: "2m" })
            res.cookie("access_token", accessToken)
            // return res.send({ status: true, data: isUser })
            // res.sendFile(__dirname + "/dashboard.html")
            res.redirect(`http://127.0.0.1:5500/index.html?token=${accessToken}`)
        }
        else {
            let User = { email, name, password: uuidv4() }
            const user = await UserModel(User)
            await user.save()
            const accessToken = jwt.sign({ email, userID: user._id }, secretKey, { expiresIn: "2m" })
            await redisClient.setEx(email, 120, JSON.stringify(OTP))
            let result = await redisClient.get(email)
            console.log(result)
            mailer(OTP, email)
            res.cookie("access_token", accessToken)
            res.redirect(`http://127.0.0.1:5500/index.html?token=${accessToken}`)
            // res.sendFile(__dirname + "/dashboard.html")
        }
    }
)

// app.post('/otpverify', async (req, res) => {

//     let access_token = req.cookies.access_token
//     const { otp } = req.body

//     jwt.verify(access_token, secretKey, async (err, decoded) => {
//         if (err) {
//             return res.status(200).send({ status: false })
//         }
//         console.log(decoded)
//         let OTP = await redisClient.get(decoded.email)

//         if (otp == OTP && OTP) {
//             const user = await UserModel.findOne({ email: decoded.email })
//             const token = jwt.sign({ user }, secretKey)
//             // return res.send({ status: true, data: user })
//             res.redirect(`http://127.0.0.1:5500/lobby.html?token=${token}`)
//         }
//         else {
//             return res.status(404).send({ status: false })
//         }
//     })
// })

app.get("/valid", async (req, res) => {
    const token = req.cookies.access_token
    // const token = req.headers.authorization.split(" ")[1]
    //  https://www.googleapis.com/auth2/v1/userinfo
    //  verifying google info 
    // const isGoogleTokeValid = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
    //     headers: {
    //         Authorization: `Bearer ${token}`
    //     }
    // })
    // if (isGoogleTokeValid) {
    //     console.log(isGoogleTokeValid)
    //     res.send("protected data")
    // }
    // else {
    //     res.status(401).send({ "error": "unauthorized" })
    // }

    //  using node-fetch---------------------- 
    const isGoogleTokeValid = await
        fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => res.json())

    if (!isGoogleTokeValid.error) {

        return res.send("protected data")
    }
    else {
        res.status(401).send({ "error": isGoogleTokeValid.error })
    }
})
app.get("/auth/failure", (req, res) => {
    res.status(404).send({ "err": "Something went wrong !" })
})


app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
})



const { connection } = require("./db")
app.listen(PORT, async () => {
    try {

        await connection;
        console.log("Server is listening at 8080")
    } catch (error) {
        console.log(error)
    }
})
