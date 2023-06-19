const mongoose = require("mongoose");
require('dotenv').config();
const mongoURL = "mongodb+srv://pkthapliyal:pankajkr@cluster0.l1f5yob.mongodb.net/tic-tac-toe?retryWrites=true&w=majority";
const connection = mongoose.connect(mongoURL);


module.exports = { connection }