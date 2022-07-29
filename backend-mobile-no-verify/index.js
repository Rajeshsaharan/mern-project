//importing module & .env variable for use //
const express = require('express')
const dotenv = require('dotenv')
const crypto = require('crypto')
const otpgenerator = require('otp-generator')
const cors = require('cors')
const twilio = require('twilio')
const jwt = require('jsonwebtoken')


//for server
const app = express()
app.use(express.json())

//for socket info
const http = require('http').Server(app);
const io = require('socket.io')(http)

//for cors 
app.use(cors()) //for all route

//for accessing dotenv variable
dotenv.config()

//for creating a new instance of twilio

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_KEY)

//importing UserSchema from User Model

const User = require('./model/User')

//accessing database 
require('./config/config')()

// importing middleware

const checkAuth = require('./middleware/auth')

//cerating routes for signin

app.post('/login', async(request, response) => {
    const { phone, username } = request.body
    // const otp = otpgenerator.generate(6, {alphabets: false, upperCase: false, specialChars: false });// for otp generate random
    if (!(phone && username)){
        return response.send({error : "all fields are mendatory"})
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const timeout = 5 * 60 * 1000 //5 mintue in milisecond
    const expires = Date.now() + timeout // both are in milisecond
    const data = `${phone}.${otp}.${expires}`
    const hash = crypto.createHmac("sha256", process.env.CRYPTO_HASH_KEY).update(data).digest("hex");
    const fullHash = `${hash}.${expires}` // returns to user
    console.log(phone, process.env.TWILIO_PHONE_NUMBER)
    const message = await client.messages.create({
        body: `your otp for your phone number ${phone} is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    })
    if(message){
        const user = await new User({phone, username}).save()
        const token = await jwt.sign({_id : user._id, phone : user.phone, username : user.username}, process.env.JWT_AUTH_KEY)
        return response.send({user, fullHash, token})
    }else{
        return response.send({error : "something is wrong"})
    }
    
    
});

app.post('/verify',checkAuth, async(request, response)=>{
    const {phone, otp , hash} = request.body
    if(!(otp && hash)){
        return response.send({error : "please login first"})
    } 
    const [hashValue, expires] = hash.split('.')
    const now = Date.now()
    if (now > parseInt(expires)){
        return response.send({error : "timeout"})
    }
    const data = `${phone}.${otp}.${expires}`;
    const newHashvalue =crypto.createHmac("sha256", process.env.CRYPTO_HASH_KEY).update(data).digest("hex");
    if(newHashvalue === hashValue){
        const user = await User.findOne({ phone: phone })
        return response.send({user : request.user , isAuth : true});
    }else{
        return response.send({error : "invalid otp"})
    }
})
//start server on port

app.listen(process.env.PORT)