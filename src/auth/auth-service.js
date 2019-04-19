const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('thingful_users')
      .where({ user_name })
      .first();
  },
  comparePasswords(password, hash) { //compare the password that we submitted in the request with the password for the user we found in the database.
       return bcrypt.compare(password, hash)
     },

     createJwt(subject, payload){ // function for making JWT
       return jwt.sign(payload, config.JWT_SECRET, { //jwt.sign method grabs JWT secret from config 
          subject,
          algorithm: 'HS256',
       })
     },
     verifyJwt(token) {
       console.log("=================/////")
       return jwt.verify(token, config.JWT_SECRET, {
         algorithms: ['HS256'],
       })
     },

  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':');
  },
};
    
module.exports = AuthService;