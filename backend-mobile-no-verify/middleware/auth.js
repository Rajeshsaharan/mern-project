const jwt = require('jsonwebtoken')


function checkAuth(request, response,next){
    token = request.body.token || request.params.token || request.header['access-token']
    if(!token){
        return response.send({error : "token not found"})
    }
    const user = jwt.verify(token, process.env.JWT_AUTH_KEY)
    request.user  = user
    next()
}

module.exports = checkAuth