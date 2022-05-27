const router = require('express').Router();
const model = require('./auth-model')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const secret = require('./secret')



/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.
  DO NOT EXCEED 2^8 ROUNDS OF HASHING!

  1- In order to register a new account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel", // must not exist already in the `users` table
      "password": "foobar"          // needs to be hashed before it's saved
    }

  2- On SUCCESSFUL registration,
    the response body should have `id`, `username` and `password`:
    {
      "id": 1,
      "username": "Captain Marvel",
      "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
    }

  3- On FAILED registration due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED registration due to the `username` being taken,
    the response body should include a string exactly as follows: "username taken".
*/
router.post('/register', (req, res) => {
  const user = req.body

  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash

  model.add(user)
  .then(results => {
    res.status(201).json(results)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: 'Failed to register user' })
  })
});

/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.

  1- In order to log into an existing account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel",
      "password": "foobar"
    }

  2- On SUCCESSFUL login,
    the response body should have `message` and `token`:
    {
      "message": "welcome, Captain Marvel",
      "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    }

  3- On FAILED login due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    the response body should include a string exactly as follows: "invalid credentials".
*/
router.post('/login', (req, res) => {
  const { password } = req.body
  const { body } = req

  function generateToken(user) {
    const payload = {
      sub: user.id,
      username: user.username
    }
    const options = { expiresIn: '1d' }
    return jwt.sign(payload, secret.JWT_SECRET, options)
  }

  model.findBy(body)
  .then(([user]) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      req.headers.authorization = token
      console.log(req.headers.authorization)
      return res.status(200).json({ message: `Welcome Back ${user.username}`, token})
    } else {
      return res.status(401).json({ message: 'invalid credentials' })
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: 'Failed to login' })
  })
});

module.exports = router;
