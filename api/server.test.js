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