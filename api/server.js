const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session')

const sessionConfig = {
    name: 'Login',
    secret: 'DahBabyIsHere218*',
    cookie: {
        maxAge: 10000 * 60,
        secure: false, 
        httpOnly: true,
    },
    resave: false, 
    saveUninitialized: false,
}

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();
server.use(session(sessionConfig))
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict.authenticated, jokesRouter); // only logged-in users should have access!

module.exports = server;
