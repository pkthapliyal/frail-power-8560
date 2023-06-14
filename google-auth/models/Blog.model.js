const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    authorID: { type: String, required: true },
    date: { type: Date, default: new Date() }

}, {
    versionKey: false
})

const BlogModel = mongoose.model("blog", blogSchema);

module.exports = { BlogModel }