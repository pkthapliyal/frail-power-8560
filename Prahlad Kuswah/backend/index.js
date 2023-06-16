const express = require('express')

const passport = require('./auth')

const app = express()
app.use(express.json())



app.get('/', (req,res)=>{
    res.send('Home Page')
})


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session:false }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    res.redirect('/');
  });

app.listen('8080', async()=>{
    try {
        await 
        console.log("running")
    } catch (error) {
        console.log(error)
    }
})