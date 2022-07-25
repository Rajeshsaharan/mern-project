//config & import
const mongoose = require('mongoose')
const User = require('./model/User')
const Post = require('./model/Post')
const dbConnect = require('./config/config')
dbConnect(); //to connect database
mongoose.pluralize(null)
const express = require('express');
const { request, response } = require('express');
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const verifyAuth = require('./middleware/auth');


//config & import ends

//handle cors //
const cors = require('cors')
app.use(cors())



//cors end

app.get('/', async (request, response) => {

    const getData = await Post.find().populate('owner', {username : 1});
    const populatedData = getData;
    //setting to send data browser //
    response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Content-Type': 'application/json'
    })
    response.write(JSON.stringify(populatedData))
    response.end();

    // Post.find()
    //     .populate("owner")
    //     .then(p => response.send(p))
    //     .catch(error => console.log(error));

})

app.post("/create", verifyAuth, async (request, response) => {
    const {title, body} = request.body
    const owner = request.user
    try {
        console.log(request.user)
        const postdata = await new Post({title, body, owner}).save() //.save methods also return an Promise so we should use 
        const populatedData = await postdata.populate('owner', {username :1})
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Content-Type': 'application/json'
        })
        response.write(JSON.stringify({populatedData, user : request.user}))
        response.end()
    }
    catch (error) {
        return response.send({ error: error })
    }
})

app.put("/update/:id"), async (request, response) => {
    try {
        const { id } = request.params.id
        const update = await new Post.updateOne({ _id: mongoose.Types.ObjectId(id) })
    } catch (error) {
        response.send({ error })
    }
}

app.post('/signin', async (request, response) => {
    const { username, password } = request.body
    if (!(username && password)) {
        return response.send({ error: "all field are required" })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await new User({ username, password: hashedPassword }).save()
        const token = jwt.sign({ _id: user.id, username: user.username }, 'secrethaibsdk')
        response.send({ user: user, token: token })
    }
    catch (error) {
        response.send({ error: error })
    }

})

app.post('/login', async (request, response) => {
    const { username, password } = request.body
    if (!(username && password)) {
        return response.send({ error: "all field are required" })
    }
    try {
        const user = await User.findOne({ username: username })
        console.log(user)
        const passwordCheck = await bcrypt.compare(password, user.password)
        if (user && passwordCheck) {
            const token = jwt.sign({ _id: user._id, username: username }, "secrethaibsdk")
            return response.send({ user: user, token: token })
        } else {
            return response.send({ error: "invalid creds" })
        }

    } catch (error) {
        return response.send({ error: error })
    }
})

app.listen(7000)


