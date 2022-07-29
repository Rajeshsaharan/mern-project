const mongoose = require('mongoose')

module.exports = async() => {
     const connect =await mongoose.connect('mongodb://localhost:27017/myDatabase')
      console.log(connect)
    }

