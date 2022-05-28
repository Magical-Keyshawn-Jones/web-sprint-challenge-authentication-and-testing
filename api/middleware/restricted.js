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
  const { token } = req.session 
  const { authorization } = req.header
  const dahBaby = authorization || token
  console.log(dahBaby)

  if (dahBaby === undefined) {
  // if (authorization === undefined) {
    return res.status(400).json({ message: 'token required' })
  } 

  jwt.verify(dahBaby, secret.JWT_SECRET, (err, decodedToken) => {
  // jwt.verify(authorization, secret.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: 'token invalid' })
    } else {
      console.log(decodedToken)
      return next()
    }
  })
}

function registerRequirements (req, res, next) {
  const { username, password } = req.body
  const { body } = req
  if (username === undefined && password === undefined) {
    return res.status(400).json({ message: 'username and password is required'})
  } else if (username === undefined) {
    return res.status(400).json({ message: 'username is required' })
  } else if (password === undefined) {
    return res.status(400).json({ message: 'password is required' })
  } 

  model.findBy(body)
  .then(results => {
    if (results.length === 0) {
      return next()
    } else {
      return res.status(400).json({ message: 'username taken'})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: 'Internal error' })
  })
}

function bodyChecker (req, res, next) {
  const { username, password } = req.body
  if (username === undefined && password === undefined) {
    return res.status(400).json({ message: 'username and password is required'})
  } else if (username === undefined) {
    return res.status(400).json({ message: 'username is required' })
  } else if (password === undefined) {
    return res.status(400).json({ message: 'password is required' })
  } else {
    return next()
  }
}

module.exports = {
  authenticated,
  bodyChecker, 
  registerRequirements, 
}