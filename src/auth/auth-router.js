const express = require('express')
const jsonBodyParser = express.json()
const authRouter = express.Router()
const AuthService = require('./auth-service')

// Our POST /api/auth/login endpoint first validates that the request body contains the credentials fields, then uses the user_name credential value to find a user from the database. If a user is found by that posted username, the password credential is validated against the bcrypted password in the database, by using bcrypt compare, and finally, if everything is good, an auth token is responded!
authRouter
.post('/login', jsonBodyParser, (req, res, next) => {
       const { user_name, password } = req.body
       const loginUser = { user_name, password }
       for (const [key, value] of Object.entries(loginUser))
         if (value == null)
           return res.status(400).json({
             error: `Missing '${key}' in request body`
           })
AuthService.getUserWithUserName(
    req.app.get('db'),
    loginUser.user_name
    )
    .then(dbUser => {
        if (!dbUser)
        return res.status(400).json({
            error: 'Incorrect user_name or password',
        })
    return AuthService.comparePasswords(loginUser.password, dbUser.password)
            .then(compareMatch => {
            if (!compareMatch)
                return res.status(400).json({
                error: 'Incorrect user_name or password',
                })
                const sub = dbUser.user_name
                const payload = {user_id: dbUser.id}
                res.send({
                    authToken: AuthService.createJwt(sub, payload),
                })
            })
    })
    .catch(next)
  })

module.exports = authRouter
