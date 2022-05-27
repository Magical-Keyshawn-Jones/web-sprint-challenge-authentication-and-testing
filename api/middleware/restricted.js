const jwt = require('jsonwebtoken')
const secret = require('../auth/secret')
const model = require('../auth/auth-model')

  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
async function authenticated (req, res, next) {
  const { authorization } = req.headers
  console.log(authorization)

  req.decodedJwt = jwt.verify(authorization, secret.JWT_SECRET)
  console.log(req.decodedJwt)

  console.log(req.decodedjwt.sub)
  const user = await model.findById(req.decodedjwt.sub)

  next()
}

function bodyChecker (req, res, next) {

}

module.exports = {
  authenticated,
  bodyChecker,  
}