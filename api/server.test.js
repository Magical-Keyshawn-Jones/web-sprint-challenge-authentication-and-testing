// Write your tests here
const db = require('../data/dbConfig')
const model = require('./auth/auth-model')
const server = require('./server')
const request = require('supertest')
const axios = require('axios')

// Make 2 test for register, login, and jokes endpoints

test('sanity', () => {
  expect(true).toBe(true)
})

// request helper 
function axiosWithAuth(token) {
  return axios.create({
    headers: {
      authorization: token
    }
  })
}

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll( async () => {
  await db.destroy()
})

beforeEach( async () => {
  await db('users').truncate()
})

describe('Register Api', () => {
  let response;

  test('Register has correct body',  async () => {
    response = await request(server).post('/api/auth/register').send({
      username: 'something'
    })
    expect(response.body).toHaveProperty('message', 'password is required')
  })

  test('Register has correct success response' , async () => {
    response = await request(server).post('/api/auth/register').send({
      username: 'Kriegster',
      password: 'DahBaby'
    })
    expect(response.body.id).toBeDefined()
    expect(response.body).toHaveProperty('username', 'Kriegster')
    expect(response.body.password).toBeDefined()
  })
})

describe('Login Api', () => {
  let response 

  test('Login has correct success response', async () => {
    response = await request(server).post('/api/auth/register').send({
      username: 'Kriegster',
      password: 'DahBaby'
    })
    response = await request(server).post('/api/auth/login').send({
      username: 'Kriegster',
      password: 'DahBaby'
    })
    expect(response.body).toHaveProperty('message', 'Welcome Kriegster')
    expect(response.body.token).toBeDefined()
  })

  test('Login fails if username does not exist in the database', async () => {
    response = await request(server).post('/api/auth/login').send({
      username: 'Kriegster',
      password: 'DahBaby'
    })
    expect(response.status).toBe(401)
  })
})

describe('Jokes Api', () => {
  let response 

  test('Jokes has correct success response', async ()  => {
    response = await request(server).post('/api/auth/register').send({
      username: 'Kriegster',
      password: 'DahBaby'
    })

    response = await request(server).post('/api/auth/login').send({
      username: 'Kriegster',
      password: 'DahBaby'
    })

    const token = response.body.token
    
    response = await request(server).get('/api/jokes').send({
      headers: {
        authorization: token
      }
    })
    expect(response.body).toBeDefined()
  })
  test('Jokes fails without a token', async ()  => {
    response = await request(server).get('/api/jokes')
    expect(response.status).toBe(400)
  })
})