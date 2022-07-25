const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username : String,
    password : String,
    posts : [{
        type : mongoose.Types.ObjectId,
        ref : 'Post' // ref shoul be equal to model Name not to collection
    }]
})

module.exports = mongoose.model('User', userSchema, 'User')