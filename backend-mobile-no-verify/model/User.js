const mongoose = require('mongoose')

const Userschema = mongoose.Schema({
    username : String,
    phone : String,
    firstName : String,
    lastName : String,
    bio : String,
})

module.exports = mongoose.model('User', Userschema, 'User')