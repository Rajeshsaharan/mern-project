const jwt = require('jsonwebtoken')

function verifyAuth(request, response, next) {
    const token = request.body.token || request.params.token || request.headers['x-access-token']
    if (!token) {
        return response.send("please login first")
    }
    try {
        const user = jwt.verify(token, "secrethaibsdk")
        request.user = user
    } catch (error) {
        return response.send({ error })
    }
    next()
}

module.exports = verifyAuth