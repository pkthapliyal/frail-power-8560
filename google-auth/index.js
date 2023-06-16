const express = require("express");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const app = express();
var session = require('express-session')
const passport = require("passport");
const cors = require('cors')
const GitHubStrategy = require('passport-github2').Strategy;
const { v4: uuidv4 } = require('uuid');
var cookieParser = require('cookie-parser')
require('dotenv').config();
const secretKey = process.env.secretKey
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

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
        let password = uuidv4()
        isUser = await UserModel.findOne({ email })
        if (isUser) {
            // user = UserModel({ email, name, password })
            // await user.save()
            const accessToken = jwt.sign({ email, userID: isUser._id }, secretKey, { expiresIn: "2m" })
            res.cookie("access_token", googleAccessToken)
            res.sendFile(__dirname + "/dashboard.html")
            // return res.status(200).send({ message : "Login Successfull", accessToken : accessToken })
           
        }
        user = UserModel({ email, name, password })
        await user.save()
        const accessToken = jwt.sign({ email, userID: user._id }, secretKey, { expiresIn: "2m" })
        res.cookie("access_token", googleAccessToken)
        res.sendFile(__dirname + "/dashboard.html")
        // res.status(200).send({ message : "Login Successfull", accessToken : accessToken })
    }
)


app.post('/otpverify', async(req, res)=>{
    let access_token = req.cookies
    console.log(access_token)
    const {otp} =  req.body
    console.log(otp)
    let OTP = await client.get()
    if(otp == OTP && OTP) {
        const user = await UserModel.findOne(email)
        const token = jwt.sign({email : user})
        return res.send({status : true})
    }
    else{
        return res.status(404).send({status : false})
    }
})

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

app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
})



//............Git HUB ....................

const isAuth = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect("/login")
    }
}


app.get("/", isAuth, async (req, res) => {
    res.sendFile(__dirname + "/dashboard.html")
})

app.get("/dashboard", isAuth, async (req, res) => {
    res.sendFile(__dirname + "/dashboard.html")
})

app.get("/login", async (req, res) => {
    if (req.user) {
        return res.redirect("/")
    }
    res.sendFile(__dirname + "/login.html")
})

passport.serializeUser(function (user, cb) {
    cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
    cb(null, id)
})


app.get("/auth/failure", (req, res) => {
    res.status(404).send({ "err": "Something went wrong !" })
})

const { connection } = require("./db")
app.listen(8080, async () => {
    try {
        await connection;
        console.log("Server is listening at 8080")
    } catch (error) {
        console.log(error)
    }
})
