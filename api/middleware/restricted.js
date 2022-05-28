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
  try {
    const { token } = req.session
    // const token = req.headers.authorization
    console.log(token)

    req.decodeJwt = jwt.verify(token, secret.JWT_SECRET, (err, decodeToken) => {
      if (err) {
        console.log(err)
        res.status(500).json({ message: 'Failed to Authenticate' })
      } else {
        model.findById(decodeToken.sub)
        .then(results => {
          console.log(results)
          // return res.status(200).json(results)
          return next()
        })
      }
    })

    // next()
  } catch(err) {
    console.log(err)
  }
}

function bodyChecker (req, res, next) {

}

module.exports = {
  authenticated,
  bodyChecker,  
}