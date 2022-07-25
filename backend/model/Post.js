const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: String,
    body: String,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User' // ref should be equal to model Name not to collection
           }


})

module.exports = mongoose.model('Post', postSchema, 'Post')